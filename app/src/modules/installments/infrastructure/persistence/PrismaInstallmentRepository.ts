import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { InstallmentRepository, InstallmentFilters } from '../../domain/repositories/InstallmentRepository.interface';
import { Installment } from '../../domain/entities/Installment.entity';
import { InstallmentPayment } from '../../domain/entities/InstallmentPayment.entity';
import { calculateSkip } from '../../../../shared/utils/pagination.helper';

@Injectable()
export class PrismaInstallmentRepository implements InstallmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(installment: Installment): Promise<Installment> {
    const created = await this.prisma.installment.create({
      data: {
        accountId: installment.accountId,
        description: installment.description,
        totalAmount: installment.totalAmount,
        totalInstallments: installment.totalInstallments,
        installmentValue: installment.installmentValue,
        startDate: installment.startDate,
        archived: installment.archived,
      },
    });

    return Installment.create(
      created.id,
      created.accountId,
      created.description,
      Number(created.totalAmount),
      created.totalInstallments,
      Number(created.installmentValue),
      created.startDate,
      created.archived,
      created.archivedAt,
      created.createdAt,
    );
  }

  async findById(id: number): Promise<Installment | null> {
    const record = await this.prisma.installment.findUnique({
      where: { id },
      include: {
        payments: {
          orderBy: { installmentNumber: 'asc' },
        },
      },
    });

    if (!record) return null;

    const installment = Installment.create(
      record.id,
      record.accountId,
      record.description,
      Number(record.totalAmount),
      record.totalInstallments,
      Number(record.installmentValue),
      record.startDate,
      record.archived,
      record.archivedAt,
      record.createdAt,
    );

    installment.payments = record.payments.map((p) =>
      InstallmentPayment.create(
        p.id,
        p.installmentId,
        p.installmentNumber,
        Number(p.amount),
        p.paid,
        p.paidDate,
      ),
    );

    return installment;
  }

  async update(installment: Installment): Promise<Installment> {
    const updated = await this.prisma.installment.update({
      where: { id: installment.id },
      data: {
        description: installment.description,
        totalAmount: installment.totalAmount,
        totalInstallments: installment.totalInstallments,
        installmentValue: installment.installmentValue,
        startDate: installment.startDate,
        archived: installment.archived,
        archivedAt: installment.archivedAt,
      },
      include: {
        payments: {
          orderBy: { installmentNumber: 'asc' },
        },
      },
    });

    const result = Installment.create(
      updated.id,
      updated.accountId,
      updated.description,
      Number(updated.totalAmount),
      updated.totalInstallments,
      Number(updated.installmentValue),
      updated.startDate,
      updated.archived,
      updated.archivedAt,
      updated.createdAt,
    );

    result.payments = updated.payments.map((p) =>
      InstallmentPayment.create(
        p.id,
        p.installmentId,
        p.installmentNumber,
        Number(p.amount),
        p.paid,
        p.paidDate,
      ),
    );

    return result;
  }

  async createPayments(payments: InstallmentPayment[]): Promise<void> {
    await this.prisma.installmentPayment.createMany({
      data: payments.map((p) => ({
        installmentId: p.installmentId,
        installmentNumber: p.installmentNumber,
        amount: p.amount,
        paid: p.paid,
        paidDate: p.paidDate,
      })),
    });
  }

  async markPaymentsAsPaid(paymentIds: number[], paidDate: Date): Promise<void> {
    await this.prisma.installmentPayment.updateMany({
      where: { id: { in: paymentIds } },
      data: { paid: true, paidDate },
    });
  }

  async findByFilters(
    accountIds: number[],
    filters: InstallmentFilters,
  ): Promise<{ items: Installment[]; total: number }> {
    const page = filters.page ?? 1;
    const perPage = filters.perPage ?? 10;
    const skip = calculateSkip(page, perPage);

    const where: any = {
      accountId: { in: accountIds },
      ...(filters.includeArchived ? {} : { archived: false }),
    };

    const [records, total] = await Promise.all([
      this.prisma.installment.findMany({
        where,
        include: {
          payments: {
            orderBy: { installmentNumber: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.installment.count({ where }),
    ]);

    const items = records.map((record) => {
      const installment = Installment.create(
        record.id,
        record.accountId,
        record.description,
        Number(record.totalAmount),
        record.totalInstallments,
        Number(record.installmentValue),
        record.startDate,
        record.archived,
        record.archivedAt,
        record.createdAt,
      );

      installment.payments = record.payments.map((p) =>
        InstallmentPayment.create(
          p.id,
          p.installmentId,
          p.installmentNumber,
          Number(p.amount),
          p.paid,
          p.paidDate,
        ),
      );

      return installment;
    });

    return { items, total };
  }
}
