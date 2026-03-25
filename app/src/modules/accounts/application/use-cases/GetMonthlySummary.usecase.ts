import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class GetMonthlySummaryUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: number,
    year: number,
    month: number,
  ): Promise<{ income: number; expenses: number; balance: number; year: number; month: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const userAccounts = await this.accountRepository.findByUserId(userId, false);
    const accountIds = userAccounts.map((a) => a.id);

    if (accountIds.length === 0) {
      return { income: 0, expenses: 0, balance: 0, year, month };
    }

    const [incomeResult, expenseResult] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          accountId: { in: accountIds },
          archived: false,
          type: 'INCOME',
          date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          accountId: { in: accountIds },
          archived: false,
          type: 'EXPENSE',
          date: { gte: startDate, lt: endDate },
        },
        _sum: { amount: true },
      }),
    ]);

    const income = Number(incomeResult._sum.amount ?? 0);
    const expenses = Number(expenseResult._sum.amount ?? 0);

    return { income, expenses, balance: income - expenses, year, month };
  }
}
