import React from 'react';

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ className = '', onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-2 border-foreground text-primary focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : undefined}
      {...props}
    />
  );
}
