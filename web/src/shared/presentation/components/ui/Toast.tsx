import React from 'react';

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const typeClasses: Record<string, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-black',
};

export function Toast({ id, type, message, onClose }: ToastItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded shadow-lg min-w-[280px] ${typeClasses[type] ?? ''}`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-current opacity-70 hover:opacity-100"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">{children}</div>;
}
