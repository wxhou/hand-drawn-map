'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex h-14 w-full rounded-xl border-2 px-4 py-2 text-base transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-light-border bg-light-surface text-light-text placeholder:text-light-text-muted focus:border-light-primary focus:ring-light-primary/15',
        artistic:
          'border-[var(--art-primary-light)] bg-[var(--art-bg-paper)] text-[var(--art-text-primary)] placeholder:text-[var(--art-text-muted)] focus:border-[var(--art-primary)] focus:ring-[var(--art-primary)]/15',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, variant, ...props }, ref) => {
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
            inputVariants({ variant }),
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

export { Input, inputVariants };
