/**
 * Hook personalizado para solicitar restablecimiento de contraseña
 */
'use client';

import { useState } from 'react';
import { ForgotPasswordUseCase } from '../../application/use-cases/ForgotPassword.usecase';
import { AuthHttpRepository } from '../../infrastructure/repositories/AuthHttpRepository';
import { ForgotPasswordDTO } from '../../application/dtos/ForgotPassword.dto';

const authRepository = new AuthHttpRepository();
const forgotPasswordUseCase = new ForgotPasswordUseCase(authRepository);

export interface UseForgotPasswordResult {
  sendCode: (data: ForgotPasswordDTO) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendCode = async (data: ForgotPasswordDTO) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await forgotPasswordUseCase.execute(data);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el código';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendCode,
    isLoading,
    error,
    success,
  };
}
