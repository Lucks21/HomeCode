'use client';

import { ProtectedRoute } from '@/modules/auth/presentation/components/ProtectedRoute';
import { Sidebar } from '@/shared/presentation/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '250px', flex: 1, padding: '32px', backgroundColor: '#0b0f19' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
