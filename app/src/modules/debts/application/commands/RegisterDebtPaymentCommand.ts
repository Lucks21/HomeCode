export class RegisterDebtPaymentCommand {
  constructor(
    public readonly debtId: number,
    public readonly amount: number,
    public readonly date: string,
  ) {}
}
