/*
  Warnings:

  - The primary key for the `ai_analyses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `confidence` on the `ai_analyses` table. All the data in the column will be lost.
  - Added the required column `category` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promptVersion` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedAction` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `ai_analyses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ticketId` on the `ai_analyses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `summary` on table `ai_analyses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `sentiment` to the `ai_analyses` table without a default value. This is not possible if the table is not empty.
  - Made the column `suggestedReply` on table `ai_analyses` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- DropForeignKey
ALTER TABLE "ai_analyses" DROP CONSTRAINT "ai_analyses_ticketId_fkey";

-- AlterTable
ALTER TABLE "ai_analyses" DROP CONSTRAINT "ai_analyses_pkey",
DROP COLUMN "confidence",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "inputTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "outputTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priority" "TicketPriority" NOT NULL,
ADD COLUMN     "promptVersion" TEXT NOT NULL,
ADD COLUMN     "recommendedAction" TEXT NOT NULL,
ADD COLUMN     "totalTokens" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "ticketId",
ADD COLUMN     "ticketId" TEXT NOT NULL,
ALTER COLUMN "summary" SET NOT NULL,
DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" "Sentiment" NOT NULL,
ALTER COLUMN "suggestedReply" SET NOT NULL,
ADD CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_ticketId_key" ON "ai_analyses"("ticketId");

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
