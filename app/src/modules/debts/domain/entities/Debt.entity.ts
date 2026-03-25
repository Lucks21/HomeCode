export enum DebtStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

export class Debt {
  constructor(
    public readonly id: number,
    public readonly accountId: number,
    public description: string,
    public amount: number,
    public remainingAmount: number,
    public status: DebtStatus,
    public date: Date,
    public archived: boolean,
    public archivedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: number,
    accountId: number,
    description: string,
    amount: number,
    date: Date,
  ): Debt {
    return new Debt(
      id,
      accountId,
      description,
      amount,
      amount,
      DebtStatus.PENDING,
      date,
      false,
      null,
      new Date(),
    );
  }

  registerPayment(paymentAmount: number): void {
    this.remainingAmount -= paymentAmount;
    this.status = this.remainingAmount === 0 ? DebtStatus.PAID : DebtStatus.PARTIAL;
  }

  archive(): void {
    this.archived = true;
    this.archivedAt = new Date();
  }

  unarchive(): void {
    this.archived = false;
    this.archivedAt = null;
  }

  updateInfo(description: string, date: Date): void {
    this.description = description;
    this.date = date;
  }

  toPrimitives() {
    return {
      id: this.id,
      accountId: this.accountId,
      description: this.description,
      amount: this.amount,
      remainingAmount: this.remainingAmount,
      status: this.status,
      date: this.date,
      archived: this.archived,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
    };
  }
}
