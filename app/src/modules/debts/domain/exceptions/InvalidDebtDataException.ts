import { DomainException } from '../../../../shared/domain/DomainException';

export class InvalidDebtDataException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
