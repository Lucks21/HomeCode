/**
 * Componente: Formulario de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const submittedEmail = String(formData.get('email') ?? '').trim();
    const submittedPassword = String(formData.get('password') ?? '');

    if (!submittedEmail || !submittedPassword) return;

    try {
      await login({ email: submittedEmail, password: submittedPassword });
      router.replace('/dashboard');
    } catch {}
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

        <button type="submit" disabled={isLoading} className={styles.submit}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className={styles.links}>
        <a href="/reset-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </section>
  );
}
