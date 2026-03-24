/**
 * Componente: Formulario para solicitar restablecimiento de contraseña
 */
'use client';

import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { sendCode, isLoading, error, success } = useForgotPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendCode({ email });
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (err) {
      console.error('Error al enviar código:', err);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 448, margin: '0 auto' }}>
      <div
        style={{
          background: '#111827',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          borderRadius: 12,
          padding: 32,
          border: '1px solid #1e293b',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '50%',
              marginBottom: 16,
            }}
          >
            <svg
              style={{ width: 32, height: 32, color: '#10b981' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
            ¿Olvidaste tu contraseña?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4, marginBottom: 0 }}>
            Ingresa tu email y te enviaremos un código para restablecer tu contraseña
          </p>
        </div>

        {success ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderLeft: '4px solid #10b981',
              padding: 16,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex' }}>
              <div style={{ flexShrink: 0 }}>
                <svg
                  style={{ height: 20, width: 20, color: '#10b981' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div style={{ marginLeft: 12 }}>
                <p style={{ fontSize: '0.875rem', color: '#a7f3d0', fontWeight: 500, margin: 0 }}>
                  ¡Código enviado! Revisa tu correo electrónico.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: 8,
                }}
              >
                Correo electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    paddingLeft: 12,
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <svg
                    style={{ height: 20, width: 20, color: '#64748b' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    paddingLeft: 40,
                    paddingRight: 12,
                    paddingTop: 10,
                    paddingBottom: 10,
                    border: '1px solid #2d3748',
                    borderRadius: 8,
                    outline: 'none',
                    background: isLoading ? '#0b0f19' : '#1a2332',
                    color: '#e2e8f0',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #10b981')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: '4px solid #ef4444',
                  padding: 16,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ flexShrink: 0 }}>
                    <svg
                      style={{ height: 20, width: 20, color: '#ef4444' }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div style={{ marginLeft: 12 }}>
                    <p style={{ fontSize: '0.875rem', color: '#fca5a5', fontWeight: 500, margin: 0 }}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email}
              style={{
                width: '100%',
                background: isLoading || !email ? '#1e293b' : '#10b981',
                color: isLoading || !email ? '#64748b' : '#ffffff',
                fontWeight: 600,
                padding: '12px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: isLoading || !email ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && email) e.currentTarget.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!isLoading && email) e.currentTarget.style.background = '#10b981';
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 12,
                      animation: 'spin 1s linear infinite',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      style={{ opacity: 0.25 }}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      style={{ opacity: 0.75 }}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando código...
                </span>
              ) : (
                'Enviar código de verificación'
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a
            href="/login"
            style={{
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#10b981')}
          >
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
