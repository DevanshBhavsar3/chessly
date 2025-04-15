import React from "react";

interface RadioProps extends React.ButtonHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const baseStyle =
  "has-checked:bg-primary has-checked:text-primary-foreground bg-muted border has-checked:border-primary-dark border-muted-dark cursor-pointer hover:bg-muted-dark px-4 py-2 rounded-md";

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    const childs = props.children;
    delete props.children;

    return (
      <label className={`${baseStyle} ${className}`}>
        <input type="radio" ref={ref} className="hidden" {...props} />
        {childs}
      </label>
    );
  }
);
