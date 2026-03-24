import { DomainException } from '../../../../shared/domain/DomainException';

export class TooManyInstallmentsToPayException extends DomainException {
  constructor() {
    super('No se pueden pagar más cuotas que las pendientes');
  }
}
