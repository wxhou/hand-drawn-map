'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-xl border-2 border-light-border bg-light-surface px-4 py-2 text-base text-light-text placeholder:text-light-text-muted',
            'transition-all duration-200',
            'focus:border-light-primary focus:outline-none focus:ring-4 focus:ring-light-primary/15',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-light-error focus:border-light-error focus:ring-light-error/15',
            icon && 'pl-12',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-light-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
