/**
 * Implementación HTTP del repositorio de autenticación
 * Realiza las llamadas a la API de autenticación
 */
import { IAuthRepository } from '../../domain/repositories/AuthRepository.interface';
import { AuthTokens } from '../../domain/entities/AuthTokens.entity';
import { User } from '../../domain/entities/User.entity';
import { apiClient, ApiResponse } from '../../../../shared/infrastructure/http/api-client';
import { localStorageService } from '../../../../shared/infrastructure/storage/LocalStorage.service';
import { STORAGE_KEYS } from '../../presentation/hooks/useAuthToken';

export class AuthHttpRepository implements IAuthRepository {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await apiClient.post<any>('/auth/login', { email, password });

    // El backend devuelve snake_case (access_token, refresh_token)
    const tokens: AuthTokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };

    if (!tokens.accessToken || !tokens.refreshToken) {
      console.error('[AuthHttpRepository] Invalid tokens!');
      throw new Error('Estructura de tokens inválida en la respuesta');
    }

    // Guardar tokens en localStorage
    localStorageService.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

    return tokens;
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    const token = localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const response = await apiClient.get<ApiResponse<User>>('/auth/me', { token });

    return response.data;
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(refreshToken: string): Promise<void> {
    const token = localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);

    try {
      await apiClient.post('/auth/logout', { refreshToken }, { token: token || undefined });
    } finally {
      // Limpiar tokens independientemente del resultado
      localStorageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
      localStorageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  /**
   * Refresca el token de acceso
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });

    const tokens: AuthTokens = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    };

    // Actualizar tokens en localStorage
    localStorageService.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

    return tokens;
  }

  /**
   * Obtiene el token de acceso del localStorage
   */
  getAccessToken(): string | null {
    return localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Obtiene el token de refresco del localStorage
   */
  getRefreshToken(): string | null {
    return localStorageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Solicita un código para restablecer la contraseña
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });

    return response;
  }

  /**
   * Verifica el código de restablecimiento de contraseña
   */
  async verifyResetCode(
    email: string,
    code: string,
  ): Promise<{ message: string; isValid: boolean }> {
    const response = await apiClient.post<{ valid: boolean; message?: string }>(
      '/auth/verify-reset-code',
      { email, code },
    );

    return {
      message: response.message || 'Código verificado',
      isValid: response.valid,
    };
  }

  /**
   * Restablece la contraseña del usuario
   */
  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
      email,
      code,
      newPassword,
      confirmPassword: newPassword,
    });

    // Limpiar tokens al resetear contraseña
    localStorageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
    localStorageService.remove(STORAGE_KEYS.REFRESH_TOKEN);

    return response;
  }
}
