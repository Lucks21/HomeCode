import { DomainException } from '../../../../shared/domain/DomainException';

export class PaymentExceedsRemainingException extends DomainException {
  constructor() {
    super('El monto del pago excede el saldo pendiente');
  }
}
