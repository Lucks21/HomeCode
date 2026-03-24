import { Module } from '@nestjs/common';
import { DebtsPersistenceModule } from './persistence/Debts.Persistence.Module';
import { AccountsPersistenceModule } from '../../accounts/infrastructure/persistence/Accounts.Persistence.Module';
import { CreateDebtUseCase } from '../application/use-cases/CreateDebt.usecase';
import { RegisterDebtPaymentUseCase } from '../application/use-cases/RegisterDebtPayment.usecase';
import { GetDebtDetailUseCase } from '../application/use-cases/GetDebtDetail.usecase';
import { ListDebtsUseCase } from '../application/use-cases/ListDebts.usecase';
import { ArchiveDebtUseCase } from '../application/use-cases/ArchiveDebt.usecase';
import { DebtsController } from '../interfaces/http/controllers/debts.controller';

@Module({
  imports: [DebtsPersistenceModule, AccountsPersistenceModule],
  controllers: [DebtsController],
  providers: [
    CreateDebtUseCase,
    RegisterDebtPaymentUseCase,
    GetDebtDetailUseCase,
    ListDebtsUseCase,
    ArchiveDebtUseCase,
  ],
  exports: [DebtsPersistenceModule],
})
export class DebtsModule {}
