-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "debts" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "installments" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3);
