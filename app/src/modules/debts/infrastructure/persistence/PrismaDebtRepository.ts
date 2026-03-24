import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { DebtRepository, DebtFilters, DebtPaginatedResult } from '../../domain/repositories/DebtRepository.interface';
import { Debt, DebtStatus } from '../../domain/entities/Debt.entity';
import { DebtPayment } from '../../domain/entities/DebtPayment.entity';
import { calculateSkip } from '../../../../shared/utils/pagination.helper';

@Injectable()
export class PrismaDebtRepository implements DebtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(debt: Debt): Promise<Debt> {
    const created = await this.prisma.debt.create({
      data: {
        accountId: debt.accountId,
        description: debt.description,
        amount: debt.amount,
        remainingAmount: debt.remainingAmount,
        status: debt.status,
        date: debt.date,
        archived: debt.archived,
      },
    });

    return new Debt(
      created.id,
      created.accountId,
      created.description,
      Number(created.amount),
      Number(created.remainingAmount),
      created.status as DebtStatus,
      created.date,
      created.archived,
      created.archivedAt,
      created.createdAt,
    );
  }

  async findById(id: number): Promise<Debt | null> {
    const debt = await this.prisma.debt.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!debt) return null;

    return new Debt(
      debt.id,
      debt.accountId,
      debt.description,
      Number(debt.amount),
      Number(debt.remainingAmount),
      debt.status as DebtStatus,
      debt.date,
      debt.archived,
      debt.archivedAt,
      debt.createdAt,
    );
  }

  async update(debt: Debt): Promise<Debt> {
    const updated = await this.prisma.debt.update({
      where: { id: debt.id },
      data: {
        description: debt.description,
        amount: debt.amount,
        remainingAmount: debt.remainingAmount,
        status: debt.status,
        date: debt.date,
        archived: debt.archived,
        archivedAt: debt.archivedAt,
      },
    });

    return new Debt(
      updated.id,
      updated.accountId,
      updated.description,
      Number(updated.amount),
      Number(updated.remainingAmount),
      updated.status as DebtStatus,
      updated.date,
      updated.archived,
      updated.archivedAt,
      updated.createdAt,
    );
  }

  async addPayment(debtId: number, amount: number, date: Date): Promise<DebtPayment> {
    const created = await this.prisma.debtPayment.create({
      data: {
        debtId,
        amount,
        date,
      },
    });

    return DebtPayment.create(
      created.id,
      created.debtId,
      Number(created.amount),
      created.date,
      created.createdAt,
    );
  }

  async findPaymentsByDebtId(debtId: number): Promise<DebtPayment[]> {
    const payments = await this.prisma.debtPayment.findMany({
      where: { debtId },
      orderBy: { date: 'asc' },
    });

    return payments.map((p) =>
      DebtPayment.create(p.id, p.debtId, Number(p.amount), p.date, p.createdAt),
    );
  }

  async findByFilters(accountIds: number[], filters: DebtFilters): Promise<DebtPaginatedResult> {
    const page = filters.page ?? 1;
    const perPage = filters.perPage ?? 10;
    const skip = calculateSkip(page, perPage);

    const where: any = {
      accountId: { in: accountIds },
      archived: false,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.date.lte = new Date(filters.dateTo);
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.debt.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { date: 'desc' },
      }),
      this.prisma.debt.count({ where }),
    ]);

    return {
      items: items.map(
        (d) =>
          new Debt(
            d.id,
            d.accountId,
            d.description,
            Number(d.amount),
            Number(d.remainingAmount),
            d.status as DebtStatus,
            d.date,
            d.archived,
            d.archivedAt,
            d.createdAt,
          ),
      ),
      total,
    };
  }
}
