// Command para crear un usuario
export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roleIds: number[],
  ) {}
}
