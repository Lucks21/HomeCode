import React from 'react';
import {
  FormProvider,
  Controller,
  type ControllerProps,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form';

export { FormProvider as Form };

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export function FormItem({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FormLabel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <label
      style={{
        color: '#e2e8f0',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </label>
  );
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!children) return null;
  return (
    <p
      style={{
        color: '#ef4444',
        fontSize: 12,
        fontWeight: 500,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function FormDescription({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        color: '#64748b',
        fontSize: 12,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
