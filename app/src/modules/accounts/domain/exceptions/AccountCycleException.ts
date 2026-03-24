import { DomainException } from '../../../../shared/domain/DomainException';

export class AccountCycleException extends DomainException {
  constructor() {
    super('No se puede asignar como padre una cuenta hija (ciclo detectado)');
  }
}
