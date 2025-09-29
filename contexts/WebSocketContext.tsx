'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { WS_EVENTS, WSMessage, DEFAULT_WS_OPTIONS } from '@/lib/websocket-client';
import { UserRole } from '@/types/auth';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  latency: number;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
  emit: (event: string, data: any) => void;
  disconnect: () => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
}

export function WebSocketProvider({ children, url }: WebSocketProviderProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState(0);
  const reconnectAttempt = useRef(0);
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  const handlersRef = useRef<Map<string, Set<Function>>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const socketUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';
    setConnecting(true);
    setError(null);

    const newSocket = io(socketUrl, {
      ...DEFAULT_WS_OPTIONS,
      auth: {
        userId: user.id,
        role: user.role
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setConnected(true);
      setConnecting(false);
      setError(null);
      reconnectAttempt.current = 0;

      // Authenticate with server
      newSocket.emit(WS_EVENTS.AUTH, {
        userId: user.id,
        role: user.role,
        token: localStorage.getItem('token') // If using JWT
      });

      // Start latency monitoring
      startLatencyMonitoring(newSocket);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setConnected(false);
      stopLatencyMonitoring();

      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setConnecting(false);
      setError(`Connection error: ${err.message}`);
      reconnectAttempt.current++;

      if (reconnectAttempt.current > 5) {
        setError('Unable to connect to server. Please check your connection.');
      }
    });

    // Authentication events
    newSocket.on(WS_EVENTS.AUTH_SUCCESS, (data) => {
      console.log('WebSocket authenticated:', data);
      addNotification({
        type: 'SUCCESS',
        title: 'Connected',
        message: 'Real-time updates enabled',
        priority: 'LOW'
      });
    });

    newSocket.on(WS_EVENTS.AUTH_ERROR, (data) => {
      console.error('WebSocket authentication error:', data);
      setError('Authentication failed');
    });

    // Handle incoming notifications
    newSocket.on(WS_EVENTS.NOTIFICATION, (notification) => {
      addNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority || 'NORMAL'
      });
    });

    // Error handling
    newSocket.on('error', (err) => {
      console.error('WebSocket error:', err);
      setError('Connection error occurred');
    });

    setSocket(newSocket);

    return () => {
      stopLatencyMonitoring();
      newSocket.disconnect();
    };
  }, [user, url, addNotification]);

  // Latency monitoring
  const startLatencyMonitoring = (socket: Socket) => {
    pingIntervalRef.current = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', () => {
        const duration = Date.now() - start;
        setLatency(duration);
      });
    }, 10000); // Ping every 10 seconds
  };

  const stopLatencyMonitoring = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
  };

  // Subscribe to events
  const subscribe = useCallback((event: string, handler: (data: any) => void) => {
    if (!socket) {
      console.warn('Cannot subscribe: socket not connected');
      return () => {};
    }

    // Add handler to our reference map
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)!.add(handler);

    // Subscribe to socket event
    socket.on(event, handler);

    // Return unsubscribe function
    return () => {
      if (socket) {
        socket.off(event, handler);
      }
      handlersRef.current.get(event)?.delete(handler);
      if (handlersRef.current.get(event)?.size === 0) {
        handlersRef.current.delete(event);
      }
    };
  }, [socket]);

  // Emit events
  const emit = useCallback((event: string, data: any) => {
    if (!socket || !connected) {
      console.warn('Cannot emit: socket not connected');
      return;
    }

    socket.emit(event, data);
  }, [socket, connected]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setConnected(false);
      setSocket(null);
    }
  }, [socket]);

  // Reconnect
  const reconnect = useCallback(() => {
    if (socket && !connected) {
      setConnecting(true);
      socket.connect();
    }
  }, [socket, connected]);

  const value: WebSocketContextType = {
    socket,
    connected,
    connecting,
    error,
    latency,
    subscribe,
    emit,
    disconnect,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Hook for real-time dashboard updates
export function useRealtimeDashboard(role: UserRole) {
  const { subscribe, connected } = useWebSocket();
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!connected) return;

    const unsubscribeDashboard = subscribe(WS_EVENTS.DASHBOARD_UPDATE, (data) => {
      setRealtimeData(data);
      setLastUpdate(new Date());
    });

    // Subscribe to role-specific events
    let unsubscribeRoleEvent: (() => void) | null = null;

    switch (role) {
      case 'UNDERWRITER':
        unsubscribeRoleEvent = subscribe(WS_EVENTS.APPLICATION_RECEIVED, (data) => {
          console.log('New application received:', data);
          setRealtimeData(prev => ({
            ...prev,
            newApplication: data
          }));
        });
        break;
      case 'COLLECTION_AGENT':
        unsubscribeRoleEvent = subscribe(WS_EVENTS.COLLECTION_ALERT, (data) => {
          console.log('Collection alert:', data);
          setRealtimeData(prev => ({
            ...prev,
            collectionAlert: data
          }));
        });
        break;
      case 'FINANCE_MANAGER':
        unsubscribeRoleEvent = subscribe(WS_EVENTS.COMPLIANCE_ALERT, (data) => {
          console.log('Compliance alert:', data);
          setRealtimeData(prev => ({
            ...prev,
            complianceAlert: data
          }));
        });
        break;
      case 'RISK_ANALYST':
        unsubscribeRoleEvent = subscribe(WS_EVENTS.RISK_ALERT, (data) => {
          console.log('Risk alert:', data);
          setRealtimeData(prev => ({
            ...prev,
            riskAlert: data
          }));
        });
        break;
      case 'SUPPORT_AGENT':
        unsubscribeRoleEvent = subscribe(WS_EVENTS.TICKET_ASSIGNED, (data) => {
          console.log('New ticket assigned:', data);
          setRealtimeData(prev => ({
            ...prev,
            newTicket: data
          }));
        });
        break;
    }

    return () => {
      unsubscribeDashboard();
      if (unsubscribeRoleEvent) {
        unsubscribeRoleEvent();
      }
    };
  }, [role, subscribe, connected]);

  return {
    realtimeData,
    lastUpdate,
    connected
  };
}

// Hook for real-time loan updates
export function useRealtimeLoanUpdates(loanId?: string) {
  const { subscribe, connected } = useWebSocket();
  const [loanUpdate, setLoanUpdate] = useState<any>(null);

  useEffect(() => {
    if (!connected || !loanId) return;

    const unsubscribe = subscribe(WS_EVENTS.LOAN_STATUS_CHANGE, (data) => {
      if (data.loanId === loanId) {
        setLoanUpdate(data);
      }
    });

    return unsubscribe;
  }, [loanId, subscribe, connected]);

  return loanUpdate;
}

// Hook for real-time metrics
export function useRealtimeMetrics() {
  const { subscribe, connected } = useWebSocket();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (!connected) return;

    const unsubscribeMetrics = subscribe(WS_EVENTS.METRICS_UPDATE, (data) => {
      setMetrics(data);
    });

    const unsubscribePerformance = subscribe(WS_EVENTS.PERFORMANCE_UPDATE, (data) => {
      setMetrics(prev => ({
        ...prev,
        performance: data
      }));
    });

    return () => {
      unsubscribeMetrics();
      unsubscribePerformance();
    };
  }, [subscribe, connected]);

  return metrics;
}