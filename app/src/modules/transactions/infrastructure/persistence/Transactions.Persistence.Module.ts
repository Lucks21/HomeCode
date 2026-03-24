import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { PrismaTransactionRepository } from './PrismaTransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../Transactions.Tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsPersistenceModule {}
