import { DomainException } from '../../../../shared/domain/DomainException';

export class InstallmentNotFullyPaidException extends DomainException {
  constructor() {
    super('Solo se pueden archivar planes con todas las cuotas pagadas');
  }
}
