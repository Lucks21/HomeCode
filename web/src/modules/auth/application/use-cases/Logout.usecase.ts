/**
 * Caso de uso: Logout
 *
 * Responsabilidades:
 * - Invalidar el refresh token en el servidor
 * - Limpiar tokens del almacenamiento local
 * - Limpiar cookies de autenticación
 */

import { IAuthRepository } from '../../domain/repositories/AuthRepository.interface';

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Ejecuta el logout
   * @param refreshToken - Token de refresh para invalidar en el servidor
   */
  async execute(refreshToken: string | null): Promise<void> {
    try {
      // Invalidar token en el servidor si existe
      if (refreshToken) {
        await this.authRepository.logout(refreshToken);
      }
    } catch (error) {
      // Loguear el error pero continuar con el logout local
      console.error('Error al invalidar token en servidor:', error);
    }

    // Siempre limpiar el almacenamiento local y cookies
    this.clearLocalStorage();
    this.clearCookies();
  }

  private clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private clearCookies(): void {
    if (typeof window === 'undefined') return;

    // Limpiar cookies de autenticación
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'refresh_token=; path=/; max-age=0';
  }
}
