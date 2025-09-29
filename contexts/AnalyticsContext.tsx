'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export interface PageView {
  id: string;
  userId: string;
  role: UserRole;
  path: string;
  title: string;
  timestamp: string;
  duration?: number;
  referrer?: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  performance: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint?: number;
  };
}

export interface UserAction {
  id: string;
  userId: string;
  role: UserRole;
  action: string;
  category: 'navigation' | 'interaction' | 'form' | 'api' | 'error';
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
  path: string;
  sessionId: string;
}

export interface SessionData {
  id: string;
  userId: string;
  role: UserRole;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews: number;
  actions: number;
  deviceInfo: {
    userAgent: string;
    platform: string;
    mobile: boolean;
    screenResolution: string;
  };
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
}

interface AnalyticsContextType {
  // Tracking methods
  trackPageView: (path: string, title: string) => void;
  trackAction: (action: string, category: UserAction['category'], metadata?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number, metadata?: Record<string, any>) => void;

  // Session management
  session: SessionData | null;
  startSession: () => void;
  endSession: () => void;

  // Analytics data
  pageViews: PageView[];
  userActions: UserAction[];

  // Configuration
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  debugMode: boolean;
  setDebugMode: (debug: boolean) => void;

  // Metrics
  getSessionMetrics: () => {
    duration: number;
    pageViews: number;
    actions: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };

  getDashboardMetrics: (role: UserRole) => {
    dailyActiveUsers: number;
    avgSessionDuration: number;
    mostVisitedPages: Array<{ path: string; views: number }>;
    topActions: Array<{ action: string; count: number }>;
    errorRate: number;
  };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const [isEnabled, setIsEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === 'development');
  const [session, setSession] = useState<SessionData | null>(null);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [currentPageStart, setCurrentPageStart] = useState<number>(Date.now());

  // Initialize session when user logs in
  useEffect(() => {
    if (user && !session) {
      startSession();
    } else if (!user && session) {
      endSession();
    }
  }, [user]);

  // Track route changes
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const title = document.title;
      trackPageView(path, title);
    };

    // Track initial page load
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            trackPerformance('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart);
            trackPerformance('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
          }

          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            trackPerformance('first_contentful_paint', entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });

      return () => observer.disconnect();
    }
  }, []);

  const startSession = useCallback(() => {
    if (!user) return;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: SessionData = {
      id: sessionId,
      userId: user.id,
      role: user.role,
      startTime: new Date().toISOString(),
      pageViews: 0,
      actions: 0,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        mobile: /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent),
        screenResolution: `${screen.width}x${screen.height}`
      },
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    setSession(newSession);

    if (debugMode) {
      console.log('Analytics: Session started', newSession);
    }
  }, [user, debugMode]);

  const endSession = useCallback(() => {
    if (!session) return;

    const endTime = new Date().toISOString();
    const duration = Date.now() - new Date(session.startTime).getTime();

    const updatedSession: SessionData = {
      ...session,
      endTime,
      duration,
      pageViews: pageViews.filter(pv => pv.userId === session.userId).length,
      actions: userActions.filter(ua => ua.userId === session.userId).length
    };

    setSession(null);

    // Send session data to analytics service
    if (isEnabled) {
      sendAnalyticsData('session_end', updatedSession);
    }

    if (debugMode) {
      console.log('Analytics: Session ended', updatedSession);
    }
  }, [session, pageViews, userActions, isEnabled, debugMode]);

  const trackPageView = useCallback((path: string, title: string) => {
    if (!isEnabled || !user || !session) return;

    // Update duration of previous page view
    if (pageViews.length > 0) {
      const lastPageView = pageViews[pageViews.length - 1];
      if (!lastPageView.duration) {
        const duration = Date.now() - currentPageStart;
        setPageViews(prev => prev.map(pv =>
          pv.id === lastPageView.id ? { ...pv, duration } : pv
        ));
      }
    }

    setCurrentPageStart(Date.now());

    const pageView: PageView = {
      id: `pv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      role: user.role,
      path,
      title,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      performance: {
        loadTime: performance.now(),
        domContentLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart || 0
      }
    };

    setPageViews(prev => [...prev, pageView]);

    if (isEnabled) {
      sendAnalyticsData('page_view', pageView);
    }

    if (debugMode) {
      console.log('Analytics: Page view tracked', pageView);
    }
  }, [isEnabled, user, session, pageViews, debugMode, currentPageStart]);

  const trackAction = useCallback((
    action: string,
    category: UserAction['category'],
    metadata?: Record<string, any>
  ) => {
    if (!isEnabled || !user || !session) return;

    const userAction: UserAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      role: user.role,
      action,
      category,
      metadata,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      sessionId: session.id
    };

    setUserActions(prev => [...prev, userAction]);

    if (isEnabled) {
      sendAnalyticsData('user_action', userAction);
    }

    if (debugMode) {
      console.log('Analytics: Action tracked', userAction);
    }
  }, [isEnabled, user, session, debugMode]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    trackAction('error_occurred', 'error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context
    });
  }, [trackAction]);

  const trackPerformance = useCallback((metric: string, value: number, metadata?: Record<string, any>) => {
    trackAction(`performance_${metric}`, 'api', {
      metric,
      value,
      ...metadata
    });
  }, [trackAction]);

  const getSessionMetrics = useCallback(() => {
    if (!session) {
      return {
        duration: 0,
        pageViews: 0,
        actions: 0,
        bounceRate: 0,
        avgTimeOnPage: 0
      };
    }

    const sessionPageViews = pageViews.filter(pv => pv.userId === session.userId);
    const sessionActions = userActions.filter(ua => ua.userId === session.userId);

    const duration = session.endTime
      ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
      : Date.now() - new Date(session.startTime).getTime();

    const avgTimeOnPage = sessionPageViews.reduce((acc, pv) => acc + (pv.duration || 0), 0) / sessionPageViews.length;
    const bounceRate = sessionPageViews.length <= 1 ? 1 : 0;

    return {
      duration,
      pageViews: sessionPageViews.length,
      actions: sessionActions.length,
      bounceRate,
      avgTimeOnPage
    };
  }, [session, pageViews, userActions]);

  const getDashboardMetrics = useCallback((role: UserRole) => {
    const rolePageViews = pageViews.filter(pv => pv.role === role);
    const roleActions = userActions.filter(ua => ua.role === role);

    // Calculate daily active users (mock - would be from API in real app)
    const today = new Date().toDateString();
    const dailyActiveUsers = new Set(
      rolePageViews
        .filter(pv => new Date(pv.timestamp).toDateString() === today)
        .map(pv => pv.userId)
    ).size;

    // Most visited pages
    const pageViewCounts = rolePageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostVisitedPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));

    // Top actions
    const actionCounts = roleActions.reduce((acc, ua) => {
      acc[ua.action] = (acc[ua.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));

    // Error rate
    const errorActions = roleActions.filter(ua => ua.category === 'error');
    const errorRate = roleActions.length > 0 ? errorActions.length / roleActions.length : 0;

    // Average session duration (mock calculation)
    const avgSessionDuration = 25 * 60 * 1000; // 25 minutes in milliseconds

    return {
      dailyActiveUsers,
      avgSessionDuration,
      mostVisitedPages,
      topActions,
      errorRate
    };
  }, [pageViews, userActions]);

  const sendAnalyticsData = useCallback((event: string, data: any) => {
    // In a real app, send to analytics service
    if (debugMode) {
      console.log(`Analytics Event: ${event}`, data);
    }

    // Mock API call
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
    }).catch(error => {
      if (debugMode) {
        console.error('Analytics: Failed to send data', error);
      }
    });
  }, [debugMode]);

  const value: AnalyticsContextType = {
    trackPageView,
    trackAction,
    trackError,
    trackPerformance,
    session,
    startSession,
    endSession,
    pageViews,
    userActions,
    isEnabled,
    setEnabled: setIsEnabled,
    debugMode,
    setDebugMode,
    getSessionMetrics,
    getDashboardMetrics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Hook for tracking specific dashboard interactions
export function useDashboardAnalytics(dashboardType: string) {
  const { trackAction, trackPerformance } = useAnalytics();

  const trackDashboardLoad = useCallback((loadTime: number) => {
    trackPerformance('dashboard_load', loadTime, { dashboardType });
  }, [trackAction, dashboardType]);

  const trackWidgetInteraction = useCallback((widgetName: string, action: string) => {
    trackAction(`${widgetName}_${action}`, 'interaction', { dashboardType, widgetName });
  }, [trackAction, dashboardType]);

  const trackDataRefresh = useCallback((dataSource: string, refreshTime: number) => {
    trackAction('data_refresh', 'api', { dashboardType, dataSource, refreshTime });
  }, [trackAction, dashboardType]);

  const trackFilterChange = useCallback((filterType: string, filterValue: string) => {
    trackAction('filter_change', 'interaction', { dashboardType, filterType, filterValue });
  }, [trackAction, dashboardType]);

  return {
    trackDashboardLoad,
    trackWidgetInteraction,
    trackDataRefresh,
    trackFilterChange
  };
}