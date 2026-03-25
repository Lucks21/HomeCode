export class CreateTransactionCommand {
  constructor(
    public readonly accountId: number,
    public readonly description: string,
    public readonly amount: number,
    public readonly type: string,
    public readonly date: Date,
  ) {}
}
