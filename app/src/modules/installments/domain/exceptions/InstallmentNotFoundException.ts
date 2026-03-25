import { DomainException } from '../../../../shared/domain/DomainException';

export class InstallmentNotFoundException extends DomainException {
  constructor(installmentId?: number) {
    super(installmentId ? `Plan de cuotas con ID ${installmentId} no encontrado` : 'Plan de cuotas no encontrado');
  }
}
