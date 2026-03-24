import { Inject, Injectable } from '@nestjs/common';
import { Debt } from '../../domain/entities/Debt.entity';
import type { DebtRepository } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { DebtNotFoundException } from '../../domain/exceptions';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class UnarchiveDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Debt> {
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      throw new DebtNotFoundException(id);
    }

    const account = await this.accountRepository.findById(debt.accountId);
    if (!account || account.userId !== userId) {
      throw new DebtNotFoundException(id);
    }

    debt.unarchive();
    return this.debtRepository.update(debt);
  }
}
