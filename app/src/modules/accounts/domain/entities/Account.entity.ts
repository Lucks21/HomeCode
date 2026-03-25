export enum AccountType {
  MAIN = 'MAIN',
  DEBT = 'DEBT',
  INSTALLMENT = 'INSTALLMENT',
}

export class Account {
  constructor(
    public readonly id: number,
    public name: string,
    public type: AccountType,
    public parentId: number | null,
    public userId: number,
    public archived: boolean,
    public archivedAt: Date | null,
    public createdAt: Date,
    public showInDashboard: boolean,
  ) {}

  static create(
    id: number,
    name: string,
    type: AccountType,
    parentId: number | null,
    userId: number,
    archived: boolean = false,
    archivedAt: Date | null = null,
    createdAt: Date = new Date(),
    showInDashboard: boolean = false,
  ): Account {
    return new Account(id, name, type, parentId, userId, archived, archivedAt, createdAt, showInDashboard);
  }

  archive(): void {
    this.archived = true;
    this.archivedAt = new Date();
  }

  unarchive(): void {
    this.archived = false;
    this.archivedAt = null;
  }

  pinToDashboard(): void {
    this.showInDashboard = true;
  }

  unpinFromDashboard(): void {
    this.showInDashboard = false;
  }

  updateInfo(name: string, type: AccountType, parentId: number | null): void {
    this.name = name;
    this.type = type;
    this.parentId = parentId;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      parentId: this.parentId,
      userId: this.userId,
      archived: this.archived,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
      showInDashboard: this.showInDashboard,
    };
  }
}
