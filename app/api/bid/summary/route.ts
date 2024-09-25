import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { error } from "console";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bidId = searchParams.get("bidId");

  if (!bidId) {
    return NextResponse.json({ error: "Bid ID is required" }, { status: 400 });
  }
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: String(bidId) },
      include: {
        items: true,
        bidders: {
          include: {
            bidderItems: {
              include: {
                bidItem: true,
                bidder: true,
              },
            },
          },
        },
      },
    });
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }
    const bidSummary = bid.items.map((item) => {
      const itemBids = bid.bidders
        .flatMap((bidder) => bidder.bidderItems)
        .filter((bidderItem) => bidderItem.bidItemId === item.id)
        .sort((a, b) => b.amount - a.amount);
      return {
        itemName: item.description,
        highestBid: itemBids.length ? itemBids[0].amount : 0,
        highestBidder: itemBids.length
          ? itemBids[0].bidder.name
          : "No bidders yet",
      };
    });
    return NextResponse.json({
      bidId: bid.id,
      bidTitle: bid.title,
      bidSummary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching bid summary" },
      { status: 500 }
    );
  }
}
