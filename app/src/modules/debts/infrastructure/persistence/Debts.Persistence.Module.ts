import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { PrismaDebtRepository } from './PrismaDebtRepository';
import { DEBT_REPOSITORY } from '../../Debts.Tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: DEBT_REPOSITORY,
      useClass: PrismaDebtRepository,
    },
  ],
  exports: [DEBT_REPOSITORY],
})
export class DebtsPersistenceModule {}
