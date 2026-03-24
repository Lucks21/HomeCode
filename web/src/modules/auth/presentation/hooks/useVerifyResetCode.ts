/**
 * Hook personalizado para verificar código de restablecimiento
 */
'use client';

import { useState } from 'react';
import { VerifyResetCodeUseCase } from '../../application/use-cases/VerifyResetCode.usecase';
import { AuthHttpRepository } from '../../infrastructure/repositories/AuthHttpRepository';
import { VerifyResetCodeDTO } from '../../application/dtos/VerifyResetCode.dto';

const authRepository = new AuthHttpRepository();
const verifyResetCodeUseCase = new VerifyResetCodeUseCase(authRepository);

export interface UseVerifyResetCodeResult {
  verifyCode: (data: VerifyResetCodeDTO) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isValid: boolean | null;
}

export function useVerifyResetCode(): UseVerifyResetCodeResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const verifyCode = async (data: VerifyResetCodeDTO): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsValid(null);

    try {
      const result = await verifyResetCodeUseCase.execute(data);
      setIsValid(result.isValid);
      return result.isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar el código';
      setError(errorMessage);
      setIsValid(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyCode,
    isLoading,
    error,
    isValid,
  };
}
