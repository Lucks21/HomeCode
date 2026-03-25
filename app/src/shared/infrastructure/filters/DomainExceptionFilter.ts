import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/DomainException';

const EXCEPTION_STATUS_MAP: Record<string, number> = {
  UserNotFoundException: HttpStatus.NOT_FOUND,
  RoleNotFoundException: HttpStatus.NOT_FOUND,
  PermissionNotFoundException: HttpStatus.NOT_FOUND,

  InvalidCredentialsException: HttpStatus.UNAUTHORIZED,
  InvalidRefreshTokenException: HttpStatus.UNAUTHORIZED,

  InactiveUserException: HttpStatus.FORBIDDEN,
  SelfDeactivationException: HttpStatus.FORBIDDEN,

  DuplicateRoleException: HttpStatus.CONFLICT,
  DuplicateEmailException: HttpStatus.CONFLICT,
  RoleHasUsersException: HttpStatus.CONFLICT,

  InvalidUserDataException: HttpStatus.BAD_REQUEST,
  InvalidRoleDataException: HttpStatus.BAD_REQUEST,
  IncoherentPermissionsException: HttpStatus.BAD_REQUEST,
  InvalidResetCodeException: HttpStatus.BAD_REQUEST,
  UsedResetCodeException: HttpStatus.BAD_REQUEST,
  ExpiredResetCodeException: HttpStatus.BAD_REQUEST,
  PasswordMismatchException: HttpStatus.BAD_REQUEST,
  WeakPasswordException: HttpStatus.BAD_REQUEST,

  // Accounts
  AccountNotFoundException: HttpStatus.NOT_FOUND,
  AccountHasActiveChildrenException: HttpStatus.CONFLICT,
  AccountHasActiveDataException: HttpStatus.CONFLICT,
  InvalidAccountDataException: HttpStatus.BAD_REQUEST,
  AccountTypeChangeException: HttpStatus.BAD_REQUEST,
  AccountCycleException: HttpStatus.BAD_REQUEST,

  // Transactions
  TransactionNotFoundException: HttpStatus.NOT_FOUND,
  InvalidTransactionDataException: HttpStatus.BAD_REQUEST,
  AccountNotMainException: HttpStatus.BAD_REQUEST,

  // Debts
  DebtNotFoundException: HttpStatus.NOT_FOUND,
  InvalidDebtDataException: HttpStatus.BAD_REQUEST,
  DebtNotPaidException: HttpStatus.CONFLICT,
  PaymentExceedsRemainingException: HttpStatus.BAD_REQUEST,

  // Installments
  InstallmentNotFoundException: HttpStatus.NOT_FOUND,
  InvalidInstallmentDataException: HttpStatus.BAD_REQUEST,
  InstallmentNotFullyPaidException: HttpStatus.CONFLICT,
  TooManyInstallmentsToPayException: HttpStatus.BAD_REQUEST,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = EXCEPTION_STATUS_MAP[exception.name] ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
