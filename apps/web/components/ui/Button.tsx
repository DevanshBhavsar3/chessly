import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "muted" | "icon";
  size?: "sm" | "md" | "lg" | "auto";
  className?: string;
}

const variantStyles = {
  default:
    "bg-muted hover:bg-muted-dark border-muted-foreground text-foreground border-b-4 ",
  primary:
    "bg-primary hover:bg-primary-dark border-primary-dark primary-m text-primary-foreground border-b-4 ",
  muted: "hover:bg-muted-dark ",
  icon: "border-0 text-muted-foreground hover:text-foreground rounded-full",
};

const sizeStyles = {
  sm: "h-7 px-2 py-1 font-sm",
  md: "h-10 px-4 py-2 font-medium",
  lg: "h-14 px-4 py-2 font-bold",
  auto: "h-fit",
};

const baseStyle =
  "border max-w-full rounded-sm cursor-pointer text-start flex items-center gap-3 transition-all duration-300";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
