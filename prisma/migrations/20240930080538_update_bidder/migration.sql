-- DropForeignKey
ALTER TABLE "Bidder" DROP CONSTRAINT "Bidder_bidId_fkey";

-- AlterTable
ALTER TABLE "Bidder" ALTER COLUMN "bidId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bidder" ADD CONSTRAINT "Bidder_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;
