import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'md', text = 'Loading...', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-nike-gray-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizeClasses[size]} mx-auto mb-4`}
        >
          <Zap className="h-full w-full text-nike-orange-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-nike-gray-600 font-medium"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-nike-gray-300 border-t-nike-orange-500`} />
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-nike-gray-200 rounded ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton className="aspect-square w-full" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <LoadingSkeleton className="h-4 flex-1" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
