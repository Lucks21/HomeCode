import { DomainException } from '../../../../shared/domain/DomainException';

export class DebtNotPaidException extends DomainException {
  constructor() {
    super('Solo se pueden archivar deudas pagadas');
  }
}
