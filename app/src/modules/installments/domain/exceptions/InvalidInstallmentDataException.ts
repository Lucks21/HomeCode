import { DomainException } from '../../../../shared/domain/DomainException';

export class InvalidInstallmentDataException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
