/**
 * Componente: Formulario para restablecer contraseña
 */
'use client';

import { useState } from 'react';
import { useResetPassword } from '../hooks/useResetPassword';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormProps {
  email: string;
  code: string;
}

export function ResetPasswordForm({ email, code }: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword, isLoading, error, success } = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validar contraseñas
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    try {
      await resetPassword({ email, code, newPassword });
      // Esperar 2 segundos y redirigir al login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
    }
  };

  const getPasswordStrength = (
    password: string,
  ): { strength: string; color: string; width: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 'Débil', color: '#ef4444', width: '33%' };
    if (strength <= 3) return { strength: 'Media', color: '#eab308', width: '66%' };
    return { strength: 'Fuerte', color: '#10b981', width: '100%' };
  };

  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  const isSubmitDisabled = isLoading || !newPassword || !confirmPassword;

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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
            Nueva contraseña
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4, marginBottom: 0 }}>
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderLeft: '4px solid #10b981',
                padding: 16,
                borderRadius: 6,
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
                    ¡Contraseña restablecida exitosamente!
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: 4, marginBottom: 0 }}>
                    Redirigiendo al inicio de sesión...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label
                htmlFor="newPassword"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: 8,
                }}
              >
                Nueva contraseña
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    paddingLeft: 40,
                    paddingRight: 40,
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
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    paddingRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 12px',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordStrength && (
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: '#94a3b8' }}>Fortaleza:</span>
                    <span style={{ fontWeight: 500, color: passwordStrength.color }}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      background: '#2d3748',
                      borderRadius: 9999,
                      height: 8,
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        borderRadius: 9999,
                        transition: 'all 0.3s',
                        background: passwordStrength.color,
                        width: passwordStrength.width,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: 8,
                }}
              >
                Confirmar contraseña
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    paddingLeft: 40,
                    paddingRight: 40,
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
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    paddingRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 12px',
                  }}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#a7f3d0',
                  marginBottom: 8,
                  marginTop: 0,
                }}
              >
                La contraseña debe contener:
              </p>
              <ul style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      marginRight: 8,
                      color: newPassword.length >= 8 ? '#10b981' : '#64748b',
                    }}
                  >
                    ✓
                  </span>
                  Al menos 8 caracteres
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      marginRight: 8,
                      color: /[A-Z]/.test(newPassword) ? '#10b981' : '#64748b',
                    }}
                  >
                    ✓
                  </span>
                  Una letra mayúscula
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      marginRight: 8,
                      color: /[a-z]/.test(newPassword) ? '#10b981' : '#64748b',
                    }}
                  >
                    ✓
                  </span>
                  Una letra minúscula
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      marginRight: 8,
                      color: /[0-9]/.test(newPassword) ? '#10b981' : '#64748b',
                    }}
                  >
                    ✓
                  </span>
                  Un número
                </li>
              </ul>
            </div>

            {(validationError || error) && (
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
                      {validationError || error}
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
                  Restableciendo contraseña...
                </span>
              ) : (
                'Restablecer contraseña'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
