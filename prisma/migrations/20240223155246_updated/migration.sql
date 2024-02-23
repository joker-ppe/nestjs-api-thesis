/*
  Warnings:

  - You are about to drop the column `deviceAccessToken` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "deviceAccessToken";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deviceAccessToken" TEXT;
