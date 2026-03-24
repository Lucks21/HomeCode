import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';
import { AccountsPersistenceModule } from './persistence/Accounts.Persistence.Module';
import { CreateAccountUseCase } from '../application/use-cases/CreateAccount.usecase';
import { UpdateAccountUseCase } from '../application/use-cases/UpdateAccount.usecase';
import { ArchiveAccountUseCase } from '../application/use-cases/ArchiveAccount.usecase';
import { UnarchiveAccountUseCase } from '../application/use-cases/UnarchiveAccount.usecase';
import { ListAccountsUseCase } from '../application/use-cases/ListAccounts.usecase';
import { GetAccountDetailUseCase } from '../application/use-cases/GetAccountDetail.usecase';
import { GetAccountSummaryUseCase } from '../application/use-cases/GetAccountSummary.usecase';
import { GetMonthlySummaryUseCase } from '../application/use-cases/GetMonthlySummary.usecase';
import { AccountsController } from '../interfaces/http/controllers/accounts.controller';

@Module({
  imports: [AccountsPersistenceModule, PrismaModule],
  controllers: [AccountsController],
  providers: [
    CreateAccountUseCase,
    UpdateAccountUseCase,
    ArchiveAccountUseCase,
    UnarchiveAccountUseCase,
    ListAccountsUseCase,
    GetAccountDetailUseCase,
    GetAccountSummaryUseCase,
    GetMonthlySummaryUseCase,
  ],
  exports: [AccountsPersistenceModule],
})
export class AccountsModule {}
