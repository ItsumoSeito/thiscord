import * as React from 'react';

import { cn } from '@/lib/utils/utils';
import { Loader2Icon } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, loading, ...props }, ref) => {
    return (
      <div className="flex items-center relative w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {loading && (
          <Loader2Icon className="absolute right-4 animate-spin text-orange-500" />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
