import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UsersModule } from './modules/users/Users.Module';
import { AccountsModule } from './modules/accounts/infrastructure/Accounts.Module';
import { TransactionsModule } from './modules/transactions/infrastructure/Transactions.Module';
import { DebtsModule } from './modules/debts/infrastructure/Debts.Module';
import { InstallmentsModule } from './modules/installments/infrastructure/Installments.Module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    DebtsModule,
    InstallmentsModule,
  ],
})
export class AppModule {}
