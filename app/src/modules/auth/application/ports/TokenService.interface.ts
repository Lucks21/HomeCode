// Port (interface) para el servicio de tokens
export interface TokenService {
  generateAccessToken(payload: any): Promise<string>;
  generateRefreshToken(payload: any): Promise<string>;
  verifyToken(token: string): Promise<any>;
}
