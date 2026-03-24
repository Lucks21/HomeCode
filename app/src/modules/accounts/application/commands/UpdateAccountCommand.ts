export class UpdateAccountCommand {
  constructor(
    public readonly name?: string,
    public readonly parentId?: number | null,
  ) {}
}
