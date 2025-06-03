import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, type, onIconClick, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          {
            "pr-10": icon,
          }
        )}
      >
        <input
          type={type}
          className={cn(
            "h-full w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-90",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div
            className="absolute inset-y-0 right-0 flex items-center justify-center mr-2"
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };