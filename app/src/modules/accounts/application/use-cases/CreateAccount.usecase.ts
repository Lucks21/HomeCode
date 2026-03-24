import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountType } from '../../domain/entities/Account.entity';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { CreateAccountCommand } from '../commands/CreateAccountCommand';
import { AccountNotFoundException, InvalidAccountDataException } from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(command: CreateAccountCommand, userId: number): Promise<Account> {
    if (!command.name || command.name.trim().length === 0) {
      throw new InvalidAccountDataException('El nombre de la cuenta es requerido');
    }

    const type = command.type as AccountType;
    if (!Object.values(AccountType).includes(type)) {
      throw new InvalidAccountDataException('Tipo de cuenta inválido');
    }

    if (command.parentId) {
      const parent = await this.accountRepository.findById(command.parentId);
      if (!parent || parent.userId !== userId) {
        throw new AccountNotFoundException(command.parentId);
      }
    }

    const account = Account.create(
      0,
      command.name.trim(),
      type,
      command.parentId ?? null,
      userId,
    );

    return this.accountRepository.create(account);
  }
}
