import { Inject, Injectable } from '@nestjs/common';
import type { DebtRepository } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { DebtNotFoundException } from '../../domain/exceptions';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';
import { Debt } from '../../domain/entities/Debt.entity';
import { DebtPayment } from '../../domain/entities/DebtPayment.entity';

export interface DebtDetailResult {
  debt: Debt;
  payments: DebtPayment[];
}

@Injectable()
export class GetDebtDetailUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(debtId: number, userId: number): Promise<DebtDetailResult> {
    const debt = await this.debtRepository.findById(debtId);
    if (!debt) {
      throw new DebtNotFoundException(debtId);
    }

    const account = await this.accountRepository.findById(debt.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(debt.accountId);
    }

    const payments = await this.debtRepository.findPaymentsByDebtId(debtId);

    return { debt, payments };
  }
}
