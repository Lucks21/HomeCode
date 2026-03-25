/**
 * Componente: Formulario para verificar código de restablecimiento
 */
'use client';

import { useState, useEffect } from 'react';
import { useVerifyResetCode } from '../hooks/useVerifyResetCode';

interface VerifyCodeFormProps {
  email: string;
  onSuccess?: (email: string, code: string) => void;
  onResend?: () => void;
}

export function VerifyCodeForm({ email, onSuccess, onResend }: VerifyCodeFormProps) {
  const { verifyCode, isLoading, error } = useVerifyResetCode();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await verifyCode({ email, code });
      if (isValid && onSuccess) {
        onSuccess(email, code);
      }
    } catch (err) {
      console.error('Error al verificar código:', err);
    }
  };

  const isSubmitDisabled = isLoading || code.length !== 6 || timeLeft <= 0;

  return (
    <div style={{ width: '100%', maxWidth: 448, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
            Verifica tu código
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4, marginBottom: 0 }}>
            Hemos enviado un código de 6 dígitos a
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981', marginTop: 4, marginBottom: 0 }}>
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label
              htmlFor="code"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#e2e8f0',
                marginBottom: 8,
              }}
            >
              Código de verificación
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
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </div>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  letterSpacing: '0.15em',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #10b981')}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 8, marginBottom: 0 }}>
              Ingresa el código de 6 dígitos que recibiste por correo
            </p>
          </div>

          {timeLeft > 0 ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderLeft: '4px solid #10b981',
                padding: 16,
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  style={{ height: 20, width: 20, color: '#10b981', marginRight: 8 }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p style={{ fontSize: '0.875rem', color: '#a7f3d0', margin: 0 }}>
                  El código expira en: <span style={{ fontWeight: 700 }}>{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid #ef4444',
                padding: 16,
                borderRadius: 6,
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#fca5a5', fontWeight: 500, margin: 0 }}>
                El código ha expirado. Por favor, solicita uno nuevo.
              </p>
            </div>
          )}

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
            disabled={isSubmitDisabled}
            style={{
              width: '100%',
              background: isSubmitDisabled ? '#1e293b' : '#10b981',
              color: isSubmitDisabled ? '#64748b' : '#ffffff',
              fontWeight: 600,
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitDisabled) e.currentTarget.style.background = '#059669';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitDisabled) e.currentTarget.style.background = '#10b981';
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
                Verificando código...
              </span>
            ) : (
              'Verificar código'
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 12, marginTop: 0 }}>
            ¿No recibiste el código?
          </p>
          <button
            type="button"
            onClick={onResend}
            disabled={isLoading}
            style={{
              fontSize: '0.875rem',
              color: isLoading ? '#64748b' : '#10b981',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              padding: 0,
              transition: 'color 0.2s',
            }}
          >
            Reenviar código
          </button>
          <div style={{ marginTop: 12 }}>
            <a
              href="/login"
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
