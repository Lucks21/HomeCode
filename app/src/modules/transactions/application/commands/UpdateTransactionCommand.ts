export class UpdateTransactionCommand {
  constructor(
    public readonly description?: string,
    public readonly amount?: number,
    public readonly type?: string,
    public readonly date?: Date,
  ) {}
}
