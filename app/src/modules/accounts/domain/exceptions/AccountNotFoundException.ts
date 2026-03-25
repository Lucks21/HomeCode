import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountNotFoundException extends DomainException {
  constructor(accountId?: number) {
    super(accountId ? `Cuenta con ID ${accountId} no encontrada` : 'Cuenta no encontrada');
  }
}
