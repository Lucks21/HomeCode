export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class Transaction {
  constructor(
    public readonly id: number,
    public accountId: number,
    public description: string,
    public amount: number,
    public type: TransactionType,
    public date: Date,
    public archived: boolean,
    public archivedAt: Date | null,
    public createdAt: Date,
  ) {}

  static create(
    id: number,
    accountId: number,
    description: string,
    amount: number,
    type: TransactionType,
    date: Date,
    archived: boolean = false,
    archivedAt: Date | null = null,
    createdAt: Date = new Date(),
  ): Transaction {
    return new Transaction(id, accountId, description, amount, type, date, archived, archivedAt, createdAt);
  }

  archive(): void {
    this.archived = true;
    this.archivedAt = new Date();
  }

  unarchive(): void {
    this.archived = false;
    this.archivedAt = null;
  }

  updateInfo(description: string, amount: number, type: TransactionType, date: Date): void {
    this.description = description;
    this.amount = amount;
    this.type = type;
    this.date = date;
  }

  toPrimitives() {
    return {
      id: this.id,
      accountId: this.accountId,
      description: this.description,
      amount: this.amount,
      type: this.type,
      date: this.date,
      archived: this.archived,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
    };
  }
}
