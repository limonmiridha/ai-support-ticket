-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('GENERAL', 'TECHNICAL', 'BILLING', 'ACCOUNT', 'FEATURE_REQUEST', 'OTHER');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "category" "TicketCategory" NOT NULL DEFAULT 'OTHER';
