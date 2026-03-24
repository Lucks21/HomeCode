export class DebtPayment {
  constructor(
    public readonly id: number,
    public readonly debtId: number,
    public readonly amount: number,
    public readonly date: Date,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: number,
    debtId: number,
    amount: number,
    date: Date,
    createdAt: Date = new Date(),
  ): DebtPayment {
    return new DebtPayment(id, debtId, amount, date, createdAt);
  }

  toPrimitives() {
    return {
      id: this.id,
      debtId: this.debtId,
      amount: this.amount,
      date: this.date,
      createdAt: this.createdAt,
    };
  }
}
