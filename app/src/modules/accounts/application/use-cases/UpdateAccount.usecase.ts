import { Inject, Injectable } from '@nestjs/common';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.interface';
import { UpdateAccountCommand } from '../commands/UpdateAccountCommand';
import {
  AccountNotFoundException,
  AccountTypeChangeException,
  AccountCycleException,
  InvalidAccountDataException,
} from '../../domain/exceptions';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';
import { Account, AccountType } from '../../domain/entities/Account.entity';

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(id: number, command: UpdateAccountCommand, userId: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account || account.userId !== userId) {
      throw new AccountNotFoundException(id);
    }

    const newName = command.name !== undefined ? command.name.trim() : account.name;
    if (!newName || newName.length === 0) {
      throw new InvalidAccountDataException('El nombre de la cuenta es requerido');
    }

    const newType = command.type !== undefined ? command.type : account.type;

    if (newType !== account.type) {
      const hasData = await this.accountRepository.hasAssociatedData(id);
      if (hasData) {
        throw new AccountTypeChangeException();
      }
    }

    const newParentId = command.parentId !== undefined ? command.parentId : account.parentId;

    if (newParentId !== null && newParentId !== undefined) {
      const parent = await this.accountRepository.findById(newParentId);
      if (!parent || parent.userId !== userId) {
        throw new AccountNotFoundException(newParentId);
      }

      if (newParentId === id) {
        throw new AccountCycleException();
      }

      const isDescendant = await this.accountRepository.isDescendantOf(newParentId, id);
      if (isDescendant) {
        throw new AccountCycleException();
      }
    }

    account.updateInfo(newName, newType, newParentId ?? null);
    if (command.showInDashboard === true) account.pinToDashboard();
    else if (command.showInDashboard === false) account.unpinFromDashboard();
    return this.accountRepository.update(account);
  }
}
