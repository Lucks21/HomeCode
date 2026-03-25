import { Inject, Injectable } from '@nestjs/common';
import { Debt } from '../../domain/entities/Debt.entity';
import type { DebtRepository } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { UpdateDebtCommand } from '../commands/UpdateDebtCommand';
import { DebtNotFoundException, InvalidDebtDataException } from '../../domain/exceptions';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class UpdateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, command: UpdateDebtCommand, userId: number): Promise<Debt> {
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      throw new DebtNotFoundException(id);
    }

    const account = await this.accountRepository.findById(debt.accountId);
    if (!account || account.userId !== userId) {
      throw new DebtNotFoundException(id);
    }

    const newDescription = command.description !== undefined ? command.description.trim() : debt.description;
    if (!newDescription || newDescription.length === 0) {
      throw new InvalidDebtDataException('La descripción es requerida');
    }

    const newDate = command.date !== undefined ? new Date(command.date) : debt.date;

    debt.updateInfo(newDescription, newDate);
    return this.debtRepository.update(debt);
  }
}
