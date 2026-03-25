export class CreateInstallmentCommand {
  constructor(
    public readonly accountId: number,
    public readonly description: string,
    public readonly totalAmount: number,
    public readonly totalInstallments: number,
    public readonly installmentValue: number | undefined,
    public readonly startDate: string,
  ) {}
}
