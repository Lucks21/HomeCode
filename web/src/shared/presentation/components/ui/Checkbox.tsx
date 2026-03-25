import React from 'react';

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ className, onCheckedChange, style, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      style={{
        width: 16,
        height: 16,
        accentColor: '#10b981',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        ...style,
      }}
      onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : undefined}
      {...props}
    />
  );
}
