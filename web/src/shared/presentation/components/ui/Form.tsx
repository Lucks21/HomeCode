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
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

export function FormLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
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
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return <p className={`text-sm font-medium text-destructive ${className}`}>{children}</p>;
}

export function FormDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}
