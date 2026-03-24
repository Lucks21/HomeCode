/**
 * Hook personalizado para el manejo de tokens de autenticación
 * Proporciona acceso reactivo a los tokens y sincronización entre pestañas
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../../../../shared/infrastructure/storage/LocalStorage.service';

/**
 * Constantes para las claves de localStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export interface UseAuthTokenResult {
  accessToken: string | null;
  refreshToken: string | null;
  hasTokens: boolean;
  isTokenExpired: (token: string) => boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

/**
 * Decodifica un JWT sin validar (solo para leer payload)
 */
function decodeJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Hook para manejar tokens de autenticación con reactividad
 */
export function useAuthToken(): UseAuthTokenResult {
  // Inicializar con los valores de localStorage (sincrónico en el cliente)
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  });

  /**
   * Carga los tokens desde localStorage
   */
  const loadTokens = useCallback(() => {
    const access = localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    const refresh = localStorageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);

    setAccessToken(access);
    setRefreshToken(refresh);
  }, []);

  /**
   * Verifica si un token JWT está expirado
   */
  const isTokenExpired = useCallback((token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload?.exp) return true;

    // Considerar expirado si faltan menos de 30 segundos
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const bufferTime = 30 * 1000; // 30 segundos

    return currentTime >= expirationTime - bufferTime;
  }, []);

  /**
   * Guarda los tokens en localStorage y actualiza el estado
   */
  const setTokens = useCallback((access: string, refresh: string) => {
    localStorageService.set(STORAGE_KEYS.ACCESS_TOKEN, access);
    localStorageService.set(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  }, []);

  /**
   * Elimina los tokens de localStorage y actualiza el estado
   */
  const clearTokens = useCallback(() => {
    localStorageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
    localStorageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  /**
   * Obtiene el access token actual
   */
  const getAccessToken = useCallback((): string | null => {
    return localStorageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }, []);

  /**
   * Obtiene el refresh token actual
   */
  const getRefreshToken = useCallback((): string | null => {
    return localStorageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  /**
   * Sincroniza tokens entre pestañas mediante storage events
   */
  useEffect(() => {
    // Escuchar cambios en localStorage de otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ACCESS_TOKEN || e.key === STORAGE_KEYS.REFRESH_TOKEN) {
        loadTokens();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [loadTokens]);

  return {
    accessToken,
    refreshToken,
    hasTokens: accessToken !== null && refreshToken !== null,
    isTokenExpired,
    setTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
  };
}
