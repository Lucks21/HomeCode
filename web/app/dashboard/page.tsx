'use client';

import { ProtectedRoute } from '@/modules/auth/presentation/components/ProtectedRoute';
import { useAuth } from '@/modules/auth/presentation/hooks/useAuth';
import { useLogout } from '@/modules/auth/presentation/hooks/useLogout';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { logout, isLoggingOut } = useLogout();

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <section
          style={{
            width: '100%',
            maxWidth: 720,
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            padding: 24,
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          }}
        >
          <h1 style={{ marginTop: 0 }}>Dashboard</h1>
          <p style={{ marginTop: 0, color: '#4b5563' }}>Sesion iniciada correctamente.</p>

          {isLoading ? (
            <p>Cargando perfil...</p>
          ) : (
            <div style={{ lineHeight: 1.8 }}>
              <div>
                <strong>ID:</strong> {user?.id ?? '-'}
              </div>
              <div>
                <strong>Nombre:</strong> {user?.name ?? '-'}
              </div>
              <div>
                <strong>Email:</strong> {user?.email ?? '-'}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={isLoggingOut}
              style={{
                background: '#0f172a',
                color: '#fff',
                border: 0,
                borderRadius: 10,
                padding: '10px 14px',
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                opacity: isLoggingOut ? 0.7 : 1,
              }}
            >
              {isLoggingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
            </button>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
