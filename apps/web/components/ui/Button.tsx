import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  className?: string;
}

const baseStyle =
  "bg-neutral-200 hover:bg-neutral-300 border border-black/10 h-10 px-4 py-2 max-w-full rounded-sm cursor-pointer border-b-4 text-start flex items-center gap-3 font-medium text-black";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, primary = true, ...props }, ref) => {
    return (
      <button ref={ref} className={`${baseStyle} ${className}`} {...props} />
    );
  }
);
