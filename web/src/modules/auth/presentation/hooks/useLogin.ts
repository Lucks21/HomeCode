/**
 * Hook personalizado para el inicio de sesión
 * Conecta el componente con el caso de uso de login
 */
'use client';

import { useState } from 'react';
import { LoginUseCase } from '../../application/use-cases/Login.usecase';
import { AuthHttpRepository } from '../../infrastructure/repositories/AuthHttpRepository';
import { LoginDTO } from '../../application/dtos/Login.dto';
import { AuthTokens } from '../../domain/entities/AuthTokens.entity';
import { useAuthToken } from './useAuthToken';

// Instancia única del repositorio y caso de uso
const authRepository = new AuthHttpRepository();
const loginUseCase = new LoginUseCase(authRepository);

export interface UseLoginResult {
  login: (credentials: LoginDTO) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  tokens: AuthTokens | null;
}

/**
 * Hook para manejar el inicio de sesión
 */
export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const { setTokens: updateTokens } = useAuthToken();

  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(credentials);

      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Tokens inválidos recibidos del servidor');
      }

      setTokens(result);
      // Actualizar tokens en el hook centralizado para sincronización
      updateTokens(result.accessToken, result.refreshToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    tokens,
  };
}
