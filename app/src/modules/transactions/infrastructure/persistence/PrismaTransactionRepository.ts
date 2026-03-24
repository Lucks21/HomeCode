import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { TransactionRepository, TransactionFilters } from '../../domain/repositories/TransactionRepository.interface';
import { Transaction, TransactionType } from '../../domain/entities/Transaction.entity';
import { calculateSkip } from '../../../../shared/utils/pagination.helper';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({
      data: {
        accountId: transaction.accountId,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        archived: transaction.archived,
      },
    });

    return Transaction.create(
      created.id,
      created.accountId,
      created.description,
      Number(created.amount),
      created.type as TransactionType,
      created.date,
      created.archived,
      created.archivedAt,
      created.createdAt,
    );
  }

  async findById(id: number): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findUnique({ where: { id } });
    if (!record) return null;

    return Transaction.create(
      record.id,
      record.accountId,
      record.description,
      Number(record.amount),
      record.type as TransactionType,
      record.date,
      record.archived,
      record.archivedAt,
      record.createdAt,
    );
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updated = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        archived: transaction.archived,
        archivedAt: transaction.archivedAt,
      },
    });

    return Transaction.create(
      updated.id,
      updated.accountId,
      updated.description,
      Number(updated.amount),
      updated.type as TransactionType,
      updated.date,
      updated.archived,
      updated.archivedAt,
      updated.createdAt,
    );
  }

  async findByFilters(
    accountIds: number[],
    filters: TransactionFilters,
  ): Promise<{ items: Transaction[]; total: number }> {
    const where: any = {
      accountId: { in: accountIds },
      archived: false,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.date.lte = filters.dateTo;
      }
    }

    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    const skip = calculateSkip(page, perPage);

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items: items.map((record) =>
        Transaction.create(
          record.id,
          record.accountId,
          record.description,
          Number(record.amount),
          record.type as TransactionType,
          record.date,
          record.archived,
          record.archivedAt,
          record.createdAt,
        ),
      ),
      total,
    };
  }
}
