import { InstallmentPayment } from './InstallmentPayment.entity';

export class Installment {
  constructor(
    public readonly id: number,
    public readonly accountId: number,
    public description: string,
    public totalAmount: number,
    public totalInstallments: number,
    public installmentValue: number,
    public startDate: Date,
    public archived: boolean,
    public archivedAt: Date | null,
    public createdAt: Date,
    public payments: InstallmentPayment[],
  ) {}

  static create(
    id: number,
    accountId: number,
    description: string,
    totalAmount: number,
    totalInstallments: number,
    installmentValue: number,
    startDate: Date,
    archived: boolean = false,
    archivedAt: Date | null = null,
    createdAt: Date = new Date(),
  ): Installment {
    return new Installment(
      id,
      accountId,
      description,
      totalAmount,
      totalInstallments,
      installmentValue,
      startDate,
      archived,
      archivedAt,
      createdAt,
      [],
    );
  }

  get paidCount(): number {
    return this.payments.filter((p) => p.paid).length;
  }

  get pendingCount(): number {
    return this.payments.filter((p) => !p.paid).length;
  }

  get progressPercentage(): number {
    if (this.payments.length === 0) return 0;
    return Math.round((this.paidCount / this.payments.length) * 100);
  }

  get isFullyPaid(): boolean {
    return this.payments.length > 0 && this.payments.every((p) => p.paid);
  }

  archive(): void {
    this.archived = true;
    this.archivedAt = new Date();
  }

  toPrimitives() {
    return {
      id: this.id,
      accountId: this.accountId,
      description: this.description,
      totalAmount: this.totalAmount,
      totalInstallments: this.totalInstallments,
      installmentValue: this.installmentValue,
      startDate: this.startDate,
      archived: this.archived,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
      paidCount: this.paidCount,
      pendingCount: this.pendingCount,
      progressPercentage: this.progressPercentage,
      payments: this.payments.map((p) => p.toPrimitives()),
    };
  }
}
