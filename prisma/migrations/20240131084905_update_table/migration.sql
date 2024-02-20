/*
  Warnings:

  - You are about to drop the column `latitude` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "latitude",
DROP COLUMN "longitude";
