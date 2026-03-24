// Puerto (Interface) para el generador de tokens JWT
// Abstrae la implementación concreta de JWT

export interface TokenPayload {
  sub: number; // User ID
  email: string;
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: number; // User ID
  email: string;
}

export interface TokenGenerator {
  /**
   * Genera un token JWT a partir de un payload
   * @param payload - Datos a incluir en el token
   * @returns string - Token JWT generado
   */
  sign(payload: TokenPayload): string;

  /**
   * Genera un refresh token JWT con expiración más larga
   * @param payload - Datos a incluir en el refresh token
   * @returns string - Refresh token JWT generado
   */
  signRefresh(payload: RefreshTokenPayload): string;

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token JWT a verificar
   * @returns TokenPayload - Payload decodificado
   */
  verify(token: string): TokenPayload;
}
