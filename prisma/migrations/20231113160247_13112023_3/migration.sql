/*
  Warnings:

  - You are about to drop the column `codeLatestAttempt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeLatestAttempt",
ADD COLUMN     "lastSMSCodeRequest" TIMESTAMP(3);
