// Command para obtener el perfil del usuario autenticado
export class GetProfileCommand {
  constructor(public readonly userId: number) {}
}
