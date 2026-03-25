export class CreateAccountCommand {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly parentId?: number | null,
  ) {}
}
