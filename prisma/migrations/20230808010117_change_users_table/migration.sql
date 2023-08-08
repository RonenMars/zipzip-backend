-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiration" TIMESTAMP(3),
ADD COLUMN     "validationCode" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
