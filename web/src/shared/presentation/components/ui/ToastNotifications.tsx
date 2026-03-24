import React from 'react';
import { Toast, ToastContainer } from './Toast';
import type { ToastItem } from '../../hooks/useToast';

interface ToastNotificationsProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export function ToastNotifications({ toasts, onClose }: ToastNotificationsProps) {
  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </ToastContainer>
  );
}
