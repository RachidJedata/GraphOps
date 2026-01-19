-- CreateEnum
CREATE TYPE "CredientielType" AS ENUM ('ANTHROPIC', 'OPENAI', 'GEMINI');

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "credientielsId" TEXT;

-- CreateTable
CREATE TABLE "Credientiels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CredientielType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credientiels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_credientielsId_fkey" FOREIGN KEY ("credientielsId") REFERENCES "Credientiels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credientiels" ADD CONSTRAINT "Credientiels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
