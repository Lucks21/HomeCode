'use client';

import { ProtectedRoute } from '@/modules/auth/presentation/components/ProtectedRoute';
import { Sidebar } from '@/shared/presentation/components/Sidebar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
