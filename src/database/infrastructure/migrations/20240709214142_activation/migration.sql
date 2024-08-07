/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(100)` to `VarChar(60)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activation_token" TEXT,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "active" SET DEFAULT false;
