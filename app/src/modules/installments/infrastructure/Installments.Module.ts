import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';
import { InstallmentsPersistenceModule } from './persistence/Installments.Persistence.Module';
import { AccountsPersistenceModule } from '../../accounts/infrastructure/persistence/Accounts.Persistence.Module';
import { CreateInstallmentUseCase } from '../application/use-cases/CreateInstallment.usecase';
import { PayInstallmentsUseCase } from '../application/use-cases/PayInstallments.usecase';
import { GetInstallmentDetailUseCase } from '../application/use-cases/GetInstallmentDetail.usecase';
import { ListInstallmentsUseCase } from '../application/use-cases/ListInstallments.usecase';
import { ArchiveInstallmentUseCase } from '../application/use-cases/ArchiveInstallment.usecase';
import { InstallmentsController } from '../interfaces/http/controllers/installments.controller';

@Module({
  imports: [InstallmentsPersistenceModule, AccountsPersistenceModule, PrismaModule],
  controllers: [InstallmentsController],
  providers: [
    CreateInstallmentUseCase,
    PayInstallmentsUseCase,
    GetInstallmentDetailUseCase,
    ListInstallmentsUseCase,
    ArchiveInstallmentUseCase,
  ],
  exports: [InstallmentsPersistenceModule],
})
export class InstallmentsModule {}
