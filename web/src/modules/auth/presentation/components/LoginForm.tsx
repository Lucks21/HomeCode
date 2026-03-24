/**
 * Componente: Formulario de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema
 */
'use client';

import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });

      // Establecer cookies manualmente para que el middleware las vea inmediatamente
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken && refreshToken) {
        // Cookies sin secure para desarrollo (http://localhost)
        document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 15}; SameSite=Lax`;
        document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      // Esperar un momento para que las cookies se establezcan
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Usar window.location para forzar recarga y que el middleware vea las cookies
      window.location.href = '/dashboard';
    } catch {
      // El error ya está manejado por el hook.
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Bienvenido</h2>
      <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={styles.input}
            placeholder="admin@homecode.com"
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={styles.input}
            placeholder="********"
            autoComplete="current-password"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading || !email || !password} className={styles.submit}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className={styles.links}>
        <a href="/reset-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </a>

        {process.env.NODE_ENV === 'development' && (
          <div className={styles.devBox}>
            <p className={styles.devTitle}>Credenciales de prueba</p>
            <div>Email: admin@homecode.com</div>
            <div>Password: admin123</div>
          </div>
        )}
      </div>
    </section>
  );
}
