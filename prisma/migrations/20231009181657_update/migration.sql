-- AlterTable
ALTER TABLE "slots" ALTER COLUMN "status" SET DEFAULT 1;

-- Insert a new SlotStatus record with a description
INSERT INTO "slotStatuses" ("description") VALUES ('Not yet');

-- Insert another SlotStatus record
INSERT INTO "slotStatuses" ("description") VALUES ('Done');

-- Insert another SlotStatus record
INSERT INTO "slotStatuses" ("description") VALUES ('Cancel');