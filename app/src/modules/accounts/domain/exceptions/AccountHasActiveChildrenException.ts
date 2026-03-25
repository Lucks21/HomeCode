import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountHasActiveChildrenException extends DomainException {
  constructor() {
    super('No se puede archivar la cuenta porque tiene subcuentas activas');
  }
}
