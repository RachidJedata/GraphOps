/*
  Warnings:

  - Added the required column `value` to the `Credientiels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credientiels" ADD COLUMN     "value" JSONB NOT NULL;
