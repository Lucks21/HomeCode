import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountNotMainException extends DomainException {
  constructor(msg?: string) {
    super(msg || 'Solo se pueden registrar movimientos en cuentas tipo MAIN');
  }
}
