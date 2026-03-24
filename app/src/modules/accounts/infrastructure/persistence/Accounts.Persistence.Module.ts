import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { PrismaAccountRepository } from './PrismaAccountRepository';
import { ACCOUNT_REPOSITORY } from '../../Accounts.Tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: PrismaAccountRepository,
    },
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountsPersistenceModule {}
