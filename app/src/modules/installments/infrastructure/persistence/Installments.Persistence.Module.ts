import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { PrismaInstallmentRepository } from './PrismaInstallmentRepository';
import { INSTALLMENT_REPOSITORY } from '../../Installments.Tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: INSTALLMENT_REPOSITORY,
      useClass: PrismaInstallmentRepository,
    },
  ],
  exports: [INSTALLMENT_REPOSITORY],
})
export class InstallmentsPersistenceModule {}
