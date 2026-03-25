import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountTypeChangeException extends DomainException {
  constructor() {
    super('No se puede cambiar el tipo de cuenta porque tiene datos asociados');
  }
}
