import { Inject, Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '../../domain/entities/Transaction.entity';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { CreateTransactionCommand } from '../commands/CreateTransactionCommand';
import { TransactionNotFoundException, InvalidTransactionDataException, AccountNotMainException } from '../../domain/exceptions';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { TRANSACTION_REPOSITORY } from '../../Transactions.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: CreateTransactionCommand, userId: number): Promise<Transaction> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(command.accountId);
    }

    if (account.type !== 'MAIN') {
      throw new AccountNotMainException();
    }

    if (!command.description || command.description.trim().length === 0) {
      throw new InvalidTransactionDataException('La descripción es requerida');
    }

    if (command.amount <= 0) {
      throw new InvalidTransactionDataException('El monto debe ser mayor a 0');
    }

    const type = command.type as TransactionType;
    if (!Object.values(TransactionType).includes(type)) {
      throw new InvalidTransactionDataException('Tipo de movimiento inválido');
    }

    const transaction = Transaction.create(
      0,
      command.accountId,
      command.description.trim(),
      command.amount,
      type,
      command.date,
    );

    return this.transactionRepository.create(transaction);
  }
}
