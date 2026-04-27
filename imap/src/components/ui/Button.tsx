'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-light-primary to-light-secondary text-white shadow-lg shadow-light-primary/25 hover:shadow-xl hover:shadow-light-primary/30 hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'border-2 border-light-border bg-light-surface text-light-text hover:bg-light-background hover:border-light-primary/50',
        outline:
          'border-2 border-light-border text-light-text hover:border-light-primary hover:text-light-primary',
        ghost: 'hover:bg-light-background/80 text-light-text',
        destructive: 'bg-light-error text-white hover:bg-light-error/90',
        success: 'bg-light-success text-white hover:bg-light-success/90',
        artistic:
          'bg-[#06B6D4] text-white border-2 border-[#06B6D4] hover:bg-[#0891B2] hover:shadow-lg hover:shadow-[#06B6D4]/20 active:scale-[0.98]',
        artisticOutline:
          'border-2 border-[#06B6D4] text-[#06B6D4] bg-transparent hover:bg-[#06B6D4] hover:text-white',
        gradient:
          'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/25 hover:shadow-xl hover:shadow-[#667eea]/30 hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm: 'h-10 rounded-lg px-4 text-xs',
        lg: 'h-14 rounded-2xl px-8 text-base',
        xl: 'h-16 rounded-2xl px-10 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
