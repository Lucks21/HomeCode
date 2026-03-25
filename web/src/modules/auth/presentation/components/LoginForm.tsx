/**
 * Componente: Formulario de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema
 */
'use client';

import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';
import { apiBaseUrl } from '@/shared/infrastructure/http/HttpClient';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const submittedEmail = String(formData.get('email') ?? '').trim();
    const submittedPassword = String(formData.get('password') ?? '');

    setLoginStatus(`Intentando login contra ${apiBaseUrl} con ${submittedEmail || '(sin email)'}`);

    if (!submittedEmail || !submittedPassword) {
      setLoginStatus('Faltan email o contraseña en el formulario');
      return;
    }

    try {
      await login({ email: submittedEmail, password: submittedPassword });
      setLoginStatus('Login OK. Redirigiendo...');

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al iniciar sesión';
      setLoginStatus(`Login falló: ${errorMessage}`);
    }
  };

  const handleCheckConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionStatus(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api`, {
        method: 'GET',
      });

      setConnectionStatus(`Conexión OK (${response.status}) - ${apiBaseUrl}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? `${err.name}: ${err.message}` : 'Error desconocido';
      setConnectionStatus(`Conexión falló - ${apiBaseUrl} - ${errorMessage}`);
    } finally {
      setIsCheckingConnection(false);
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
            name="email"
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
            name="password"
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
        {connectionStatus && <p className={styles.status}>{connectionStatus}</p>}
        {loginStatus && <p className={styles.status}>{loginStatus}</p>}

        <button type="submit" disabled={isLoading} className={styles.submit}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <button
          type="button"
          disabled={isCheckingConnection}
          className={styles.secondaryButton}
          onClick={handleCheckConnection}
        >
          {isCheckingConnection ? 'Probando conexion...' : 'Probar conexion'}
        </button>
      </form>

      <div className={styles.links}>
        <a href="/reset-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </a>

        <div className={styles.devBox}>
          <p className={styles.devTitle}>URL API actual</p>
          <div className={styles.monospace}>{apiBaseUrl}</div>
        </div>

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
