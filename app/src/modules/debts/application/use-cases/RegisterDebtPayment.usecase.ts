import { Inject, Injectable } from '@nestjs/common';
import type { DebtRepository } from '../../domain/repositories/DebtRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { RegisterDebtPaymentCommand } from '../commands/RegisterDebtPaymentCommand';
import {
  DebtNotFoundException,
  InvalidDebtDataException,
  PaymentExceedsRemainingException,
} from '../../domain/exceptions';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';
import { Debt } from '../../domain/entities/Debt.entity';
import { DebtPayment } from '../../domain/entities/DebtPayment.entity';

@Injectable()
export class RegisterDebtPaymentUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: RegisterDebtPaymentCommand, userId: number): Promise<DebtPayment> {
    const debt = await this.debtRepository.findById(command.debtId);
    if (!debt) {
      throw new DebtNotFoundException(command.debtId);
    }

    const account = await this.accountRepository.findById(debt.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(debt.accountId);
    }

    if (command.amount <= 0) {
      throw new InvalidDebtDataException('El monto del pago debe ser mayor a 0');
    }

    if (command.amount > debt.remainingAmount) {
      throw new PaymentExceedsRemainingException();
    }

    debt.registerPayment(command.amount);

    const payment = await this.debtRepository.addPayment(
      command.debtId,
      command.amount,
      new Date(command.date),
    );

    if (debt.remainingAmount === 0) {
      debt.archive();
    }

    await this.debtRepository.update(debt);

    return payment;
  }
}
