import React from 'react';
import { usePermissions } from '../../../modules/auth/presentation/hooks/usePermissions';
import { Button } from './ui/Button';

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredPermission: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export function PermissionButton({
  requiredPermission,
  children,
  variant,
  size,
  ...props
}: PermissionButtonProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(requiredPermission)) return null;

  return (
    <Button variant={variant} size={size} {...props}>
      {children}
    </Button>
  );
}
