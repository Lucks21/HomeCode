import { Inject, Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '../../domain/entities/Transaction.entity';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository.interface';
import type { AccountRepository } from '../../../accounts/domain/repositories/AccountRepository.interface';
import { UpdateTransactionCommand } from '../commands/UpdateTransactionCommand';
import { TransactionNotFoundException, InvalidTransactionDataException } from '../../domain/exceptions';
import { AccountNotFoundException } from '../../../accounts/domain/exceptions';
import { TRANSACTION_REPOSITORY } from '../../Transactions.Tokens';
import { ACCOUNT_REPOSITORY } from '../../../accounts/Accounts.Tokens';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, command: UpdateTransactionCommand, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new TransactionNotFoundException(id);
    }

    const account = await this.accountRepository.findById(transaction.accountId);
    if (!account || account.userId !== userId) {
      throw new TransactionNotFoundException(id);
    }

    const newDescription = command.description !== undefined ? command.description.trim() : transaction.description;
    if (!newDescription || newDescription.length === 0) {
      throw new InvalidTransactionDataException('La descripción es requerida');
    }

    const newAmount = command.amount !== undefined ? command.amount : transaction.amount;
    if (newAmount <= 0) {
      throw new InvalidTransactionDataException('El monto debe ser mayor a 0');
    }

    const newType = command.type !== undefined ? (command.type as TransactionType) : transaction.type;
    if (!Object.values(TransactionType).includes(newType)) {
      throw new InvalidTransactionDataException('Tipo de movimiento inválido');
    }

    const newDate = command.date !== undefined ? command.date : transaction.date;

    transaction.updateInfo(newDescription, newAmount, newType, newDate);
    return this.transactionRepository.update(transaction);
  }
}
