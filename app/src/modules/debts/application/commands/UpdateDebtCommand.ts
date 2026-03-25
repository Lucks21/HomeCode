export class UpdateDebtCommand {
  constructor(
    public readonly description?: string,
    public readonly date?: string,
  ) {}
}
