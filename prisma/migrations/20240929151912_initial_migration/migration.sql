-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,

    CONSTRAINT "BidItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bidder" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "picture" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,

    CONSTRAINT "Bidder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidderItem" (
    "id" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "bidItemId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BidderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bidder_clerkId_key" ON "Bidder"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Bidder_email_key" ON "Bidder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BidderItem_bidderId_bidItemId_key" ON "BidderItem"("bidderId", "bidItemId");

-- AddForeignKey
ALTER TABLE "BidItem" ADD CONSTRAINT "BidItem_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bidder" ADD CONSTRAINT "Bidder_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidderItem" ADD CONSTRAINT "BidderItem_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "Bidder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidderItem" ADD CONSTRAINT "BidderItem_bidItemId_fkey" FOREIGN KEY ("bidItemId") REFERENCES "BidItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
