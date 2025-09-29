'use client';

import { motion } from 'framer-motion';
import { Loader2, Shield, CreditCard, BarChart3, Phone, Headphones, TrendingUp, Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingSpinner({ size = 'md', color = 'text-blue-500' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} ${color}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
}

interface DashboardLoadingProps {
  role?: 'USER' | 'ADMIN' | 'UNDERWRITER' | 'COLLECTION_AGENT' | 'FINANCE_MANAGER' | 'RISK_ANALYST' | 'SUPPORT_AGENT';
  message?: string;
}

export function DashboardLoading({ role = 'USER', message = 'Loading dashboard...' }: DashboardLoadingProps) {
  const roleConfig = {
    USER: { icon: CreditCard, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    ADMIN: { icon: Shield, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    UNDERWRITER: { icon: Brain, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    COLLECTION_AGENT: { icon: Phone, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    FINANCE_MANAGER: { icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    RISK_ANALYST: { icon: BarChart3, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    SUPPORT_AGENT: { icon: Headphones, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-8 h-8 ${config.color}`} />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold text-slate-200 mb-2"
        >
          LaxmiOne
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 mb-4"
        >
          {message}
        </motion.p>

        <LoadingSpinner size="lg" color={config.color} />
      </motion.div>
    </div>
  );
}

interface PageLoadingProps {
  title?: string;
  description?: string;
}

export function PageLoading({ title = 'Loading...', description }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h3 className="text-lg font-medium text-slate-200 mt-4">{title}</h3>
        {description && (
          <p className="text-slate-400 mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = 'h-4 w-full', count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-slate-800 rounded-md ${className}`}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex space-x-4 p-4 bg-slate-800/30 rounded-lg">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}