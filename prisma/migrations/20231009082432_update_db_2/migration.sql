-- AlterTable
ALTER TABLE "days" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "histories" ALTER COLUMN "progress" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "description" DROP NOT NULL;
