/*
  Warnings:

  - You are about to drop the column `value` on the `Credientiels` table. All the data in the column will be lost.
  - You are about to drop the column `credientielsId` on the `Node` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_credientielsId_fkey";

-- AlterTable
ALTER TABLE "Credientiels" DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "credientielsId";
