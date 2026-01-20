/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Execution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "createdAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
