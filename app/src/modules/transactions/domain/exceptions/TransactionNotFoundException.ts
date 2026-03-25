import { DomainException } from '../../../../shared/domain/DomainException';

export class TransactionNotFoundException extends DomainException {
  constructor(transactionId?: number) {
    super(transactionId ? `Movimiento con ID ${transactionId} no encontrado` : 'Movimiento no encontrado');
  }
}
