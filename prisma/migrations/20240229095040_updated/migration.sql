/*
  Warnings:

  - You are about to drop the `slotStatuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "slotStatuses" DROP CONSTRAINT "slotStatuses_slotId_fkey";

-- DropTable
DROP TABLE "slotStatuses";
