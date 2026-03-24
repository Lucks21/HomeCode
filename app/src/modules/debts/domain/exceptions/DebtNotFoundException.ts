import { DomainException } from '../../../../shared/domain/DomainException';

export class DebtNotFoundException extends DomainException {
  constructor(debtId?: number) {
    super(debtId ? `Deuda con ID ${debtId} no encontrada` : 'Deuda no encontrada');
  }
}
