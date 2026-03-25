import { DomainException } from '../../../../shared/domain/DomainException';

export class InvalidAccountDataException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
