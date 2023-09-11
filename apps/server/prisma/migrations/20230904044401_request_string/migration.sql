/*
  Warnings:

  - Made the column `content` on table `requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;
