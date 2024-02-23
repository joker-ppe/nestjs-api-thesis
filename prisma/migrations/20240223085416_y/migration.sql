/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deviceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deviceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "devices_userId_key" ON "devices"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_deviceId_key" ON "users"("deviceId");
