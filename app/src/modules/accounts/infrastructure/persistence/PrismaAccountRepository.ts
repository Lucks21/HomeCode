import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { Account, AccountType } from '../../domain/entities/Account.entity';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(account: Account): Promise<Account> {
    const created = await this.prisma.account.create({
      data: {
        name: account.name,
        type: account.type,
        parentId: account.parentId,
        userId: account.userId,
        archived: account.archived,
      },
    });

    return Account.create(
      created.id,
      created.name,
      created.type as AccountType,
      created.parentId,
      created.userId,
      created.archived,
      created.archivedAt,
      created.createdAt,
      created.showInDashboard,
    );
  }

  async findById(id: number): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) return null;

    return Account.create(
      account.id,
      account.name,
      account.type as AccountType,
      account.parentId,
      account.userId,
      account.archived,
      account.archivedAt,
      account.createdAt,
      account.showInDashboard,
    );
  }

  async findByUserId(userId: number, includeArchived: boolean = false): Promise<Account[]> {
    const where: any = { userId };
    if (!includeArchived) {
      where.archived = false;
    }

    const accounts = await this.prisma.account.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return accounts.map((a) =>
      Account.create(
        a.id,
        a.name,
        a.type as AccountType,
        a.parentId,
        a.userId,
        a.archived,
        a.archivedAt,
        a.createdAt,
        a.showInDashboard,
      ),
    );
  }

  async findChildrenByParentId(parentId: number): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { parentId, archived: false },
      orderBy: { createdAt: 'asc' },
    });

    return accounts.map((a) =>
      Account.create(
        a.id,
        a.name,
        a.type as AccountType,
        a.parentId,
        a.userId,
        a.archived,
        a.archivedAt,
        a.createdAt,
        a.showInDashboard,
      ),
    );
  }

  async update(account: Account): Promise<Account> {
    const updated = await this.prisma.account.update({
      where: { id: account.id },
      data: {
        name: account.name,
        parentId: account.parentId,
        archived: account.archived,
        archivedAt: account.archivedAt,
        showInDashboard: account.showInDashboard,
      },
    });

    return Account.create(
      updated.id,
      updated.name,
      updated.type as AccountType,
      updated.parentId,
      updated.userId,
      updated.archived,
      updated.archivedAt,
      updated.createdAt,
      updated.showInDashboard,
    );
  }

  async hasActiveChildren(accountId: number): Promise<boolean> {
    const count = await this.prisma.account.count({
      where: { parentId: accountId, archived: false },
    });
    return count > 0;
  }

  async hasActiveTransactions(accountId: number): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: { accountId, archived: false },
    });
    return count > 0;
  }

  async hasActiveDebts(accountId: number): Promise<boolean> {
    const count = await this.prisma.debt.count({
      where: { accountId, archived: false },
    });
    return count > 0;
  }

  async hasActiveInstallments(accountId: number): Promise<boolean> {
    const count = await this.prisma.installment.count({
      where: { accountId, archived: false },
    });
    return count > 0;
  }

  async hasAssociatedData(accountId: number): Promise<boolean> {
    const [transactions, debts, installments] = await Promise.all([
      this.prisma.transaction.count({ where: { accountId } }),
      this.prisma.debt.count({ where: { accountId } }),
      this.prisma.installment.count({ where: { accountId } }),
    ]);
    return transactions > 0 || debts > 0 || installments > 0;
  }

  async getFinancialSummary(
    accountId: number,
  ): Promise<{ income: number; expenses: number; balance: number }> {
    const [incomeResult, expenseResult] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { accountId, archived: false, type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { accountId, archived: false, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    const income = Number(incomeResult._sum.amount ?? 0);
    const expenses = Number(expenseResult._sum.amount ?? 0);

    return { income, expenses, balance: income - expenses };
  }

  async isDescendantOf(accountId: number, potentialAncestorId: number): Promise<boolean> {
    let currentId: number | null = accountId;
    const visited = new Set<number>();

    while (currentId !== null) {
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const found: { parentId: number | null } | null = await this.prisma.account.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

      if (!found) return false;
      if (found.parentId === potentialAncestorId) return true;
      currentId = found.parentId;
    }

    return false;
  }
}
