import { Inject, Injectable } from '@nestjs/common';
import { Debt } from '../../domain/entities/Debt.entity';
import type { DebtRepository } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { CreateDebtCommand } from '../commands/CreateDebtCommand';
import { DebtNotFoundException, InvalidDebtDataException } from '../../domain/exceptions';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class CreateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: CreateDebtCommand, userId: number): Promise<Debt> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(command.accountId);
    }

    if (command.amount <= 0) {
      throw new InvalidDebtDataException('El monto debe ser mayor a 0');
    }

    const debt = Debt.create(
      0,
      command.accountId,
      command.description,
      command.amount,
      new Date(command.date),
    );

    return this.debtRepository.create(debt);
  }
}
