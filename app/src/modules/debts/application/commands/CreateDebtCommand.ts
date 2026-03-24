export class CreateDebtCommand {
  constructor(
    public readonly accountId: number,
    public readonly description: string,
    public readonly amount: number,
    public readonly date: string,
  ) {}
}
