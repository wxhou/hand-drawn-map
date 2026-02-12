'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  selected?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', selected, children, ...props }, ref) => {
    const variants = {
      default: 'bg-light-surface border-2 border-transparent',
      elevated: 'bg-light-surface shadow-lg shadow-light-primary/10 hover:shadow-xl',
      outlined: 'bg-light-surface border-2 border-light-border',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          'cursor-pointer',
          'hover:scale-[1.02] hover:-translate-y-1',
          selected && 'ring-2 ring-light-primary ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card };
