import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  const { bidderId, accept } = await req.json();
  try {
    const updateBidder = await prisma.bidder.update({
      where: {
        id: bidderId,
      },
      data: {
        accepted: accept,
      },
    });
    return NextResponse.json(updateBidder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update bid invitation status ${error}` },
      { status: 500 }
    );
  }
}
