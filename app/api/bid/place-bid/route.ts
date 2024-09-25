import { PlaceBidSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validation = PlaceBidSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.message },
      { status: 400 }
    );
  }

  const { bids, bidderId } = validation.data;

  try {
    const placeBids = await Promise.all(
      bids.map(async (bid) => {
        return prisma?.bidderItem.upsert({
          where: {
            bidderId_bidItemId: {
              bidderId,
              bidItemId: bid.bidItemId,
            },
          },
          update: {
            amount: bid.amount,
          },
          create: {
            bidderId,
            bidItemId: bid.bidItemId,
            amount: bid.amount,
          },
        });
      })
    );
    return NextResponse.json(
      { message: "Bids placed successfully", placeBids },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to place bids" },
      { status: 500 }
    );
  }
}
