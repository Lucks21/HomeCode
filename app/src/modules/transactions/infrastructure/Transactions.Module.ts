import { Module } from '@nestjs/common';
import { TransactionsPersistenceModule } from './persistence/Transactions.Persistence.Module';
import { AccountsPersistenceModule } from '../../accounts/infrastructure/persistence/Accounts.Persistence.Module';
import { CreateTransactionUseCase } from '../application/use-cases/CreateTransaction.usecase';
import { UpdateTransactionUseCase } from '../application/use-cases/UpdateTransaction.usecase';
import { ArchiveTransactionUseCase } from '../application/use-cases/ArchiveTransaction.usecase';
import { UnarchiveTransactionUseCase } from '../application/use-cases/UnarchiveTransaction.usecase';
import { ListTransactionsUseCase } from '../application/use-cases/ListTransactions.usecase';
import { TransactionsController } from '../interfaces/http/controllers/transactions.controller';

@Module({
  imports: [TransactionsPersistenceModule, AccountsPersistenceModule],
  controllers: [TransactionsController],
  providers: [
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    ArchiveTransactionUseCase,
    UnarchiveTransactionUseCase,
    ListTransactionsUseCase,
  ],
  exports: [TransactionsPersistenceModule],
})
export class TransactionsModule {}
