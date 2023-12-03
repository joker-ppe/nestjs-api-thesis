/*
  Warnings:

  - You are about to drop the column `information` on the `devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[macAddress,serialNumber]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "information",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "macAddress" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'New Device',
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "systemInfo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "devices_macAddress_serialNumber_key" ON "devices"("macAddress", "serialNumber");
