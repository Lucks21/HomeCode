import { AccountType } from '../../domain/entities/Account.entity';

export class UpdateAccountCommand {
  constructor(
    public readonly name?: string,
    public readonly type?: AccountType,
    public readonly parentId?: number | null,
  ) {}
}
