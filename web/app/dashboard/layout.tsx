'use client';

import { ProtectedRoute } from '@/modules/auth/presentation/components/ProtectedRoute';
import { Sidebar } from '@/shared/presentation/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '250px', flex: 1, padding: '24px', backgroundColor: '#f5f5f5' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
