export class InstallmentPayment {
  constructor(
    public readonly id: number,
    public readonly installmentId: number,
    public readonly installmentNumber: number,
    public readonly amount: number,
    public paid: boolean,
    public paidDate: Date | null,
  ) {}

  static create(
    id: number,
    installmentId: number,
    installmentNumber: number,
    amount: number,
    paid: boolean = false,
    paidDate: Date | null = null,
  ): InstallmentPayment {
    return new InstallmentPayment(id, installmentId, installmentNumber, amount, paid, paidDate);
  }

  markAsPaid(date: Date): void {
    this.paid = true;
    this.paidDate = date;
  }

  toPrimitives() {
    return {
      id: this.id,
      installmentId: this.installmentId,
      installmentNumber: this.installmentNumber,
      amount: this.amount,
      paid: this.paid,
      paidDate: this.paidDate,
    };
  }
}
