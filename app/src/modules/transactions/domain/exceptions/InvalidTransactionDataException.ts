import { DomainException } from '../../../../shared/domain/DomainException';

export class InvalidTransactionDataException extends DomainException {
  constructor(msg?: string) {
    super(msg || 'Datos del movimiento inválidos');
  }
}
