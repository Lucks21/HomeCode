import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountHasActiveDataException extends DomainException {
  constructor() {
    super('No se puede archivar la cuenta porque tiene movimientos, deudas o cuotas activas');
  }
}
