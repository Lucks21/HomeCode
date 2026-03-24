// Result del caso de uso de RefreshToken
// Representa el nuevo token de acceso generado

export class RefreshTokenResult {
  constructor(
    public readonly accessToken: string,
    public readonly expiresIn: string,
  ) {}
}
