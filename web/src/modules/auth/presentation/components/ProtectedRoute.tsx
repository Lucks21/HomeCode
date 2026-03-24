/**
 * Componente para proteger rutas que requieren permisos específicos
 * Muestra un mensaje de error o redirige si el usuario no tiene los permisos necesarios
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '../hooks/usePermissions';
import { useAuthToken } from '../hooks/useAuthToken';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Permisos requeridos - el usuario debe tener AL MENOS UNO de estos permisos
   */
  requiredPermissions?: string[];
  /**
   * Si es true, el usuario debe tener TODOS los permisos especificados
   */
  requireAllPermissions?: boolean;
  /**
   * Ruta a la que redirigir si no tiene permisos (por defecto muestra mensaje de error)
   */
  redirectTo?: string;
  /**
   * Mensaje personalizado a mostrar si no tiene permisos
   */
  unauthorizedMessage?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAllPermissions = false,
  redirectTo,
  unauthorizedMessage = 'No tienes autorización para acceder a esta página',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasTokens } = useAuthToken();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!hasTokens) {
      router.push('/login');
      return;
    }

    // Si no hay permisos requeridos, permitir acceso
    if (requiredPermissions.length === 0) {
      setIsChecking(false);
      return;
    }

    // Verificar permisos
    const hasPermission = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasPermission) {
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        setIsChecking(false);
      }
      return;
    }

    setIsChecking(false);
  }, [
    hasTokens,
    requiredPermissions,
    requireAllPermissions,
    hasAllPermissions,
    hasAnyPermission,
    redirectTo,
    router,
  ]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f19',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid #1e293b',
              borderTopColor: '#10b981',
              animation: 'spin 1s linear infinite',
              marginBottom: 16,
            }}
          ></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
            Verificando permisos...
          </p>
        </div>
      </div>
    );
  }

  // Verificar si tiene permisos
  if (requiredPermissions.length > 0) {
    const hasPermission = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasPermission && !redirectTo) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0b0f19',
          }}
        >
          <div
            style={{
              maxWidth: 448,
              width: '100%',
              background: '#111827',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
              border: '1px solid #1e293b',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <svg
                style={{ margin: '0 auto', height: 64, width: 64, color: '#ef4444' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#f1f5f9',
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              Acceso Denegado
            </h2>
            <p
              style={{
                color: '#94a3b8',
                marginBottom: 24,
                marginTop: 0,
                fontSize: '0.95rem',
              }}
            >
              {unauthorizedMessage}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  width: '100%',
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 600,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => router.back()}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #2d3748',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2332')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Volver
              </button>
            </div>
            {requiredPermissions.length > 0 && (
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: '1px solid #1e293b',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: 8,
                    marginTop: 0,
                  }}
                >
                  Permisos requeridos:
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  {requiredPermissions.map((permission) => (
                    <span
                      key={permission}
                      style={{
                        display: 'inline-block',
                        background: '#1a2332',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        padding: '4px 12px',
                        borderRadius: 9999,
                        border: '1px solid #2d3748',
                      }}
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
