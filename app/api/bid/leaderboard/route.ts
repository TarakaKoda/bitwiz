import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(req: NextRequest) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  try {
    const leaderboard = await prisma.bidItem.findMany({
      include: {
        bidderItems: {
          include: {
            bidder: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            amount: "desc",
          },
          take: 1,
        },
      },
    });

    const formattedLeaderboard = leaderboard.map((bidItem) => ({
      bidItemId: bidItem.id,
      description: bidItem.description,
      highestBid: bidItem.bidderItems[0]?.amount || 0,
      highestBidder: bidItem.bidderItems[0]?.bidder.name || "No bids",
    }));

    return NextResponse.json(formattedLeaderboard, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboard ${error}` },
      { status: 500 }
    );
  }
}
