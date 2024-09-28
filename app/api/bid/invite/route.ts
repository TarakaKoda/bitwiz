import { InviteBiddersSchema } from "@/lib/validations";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validation = InviteBiddersSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.message },
      { status: 400 }
    );
  }

  const { bidId, bidders } = validation.data;

  try {
    const invitedBidders = await Promise.all(
      bidders.map((bidder) => {
        return prisma.bidder.create({
          data: {
            clerkId: bidder.clerkId,
            name: bidder.name,
            picture: bidder.picture,
            email: bidder.email,
            bidId,
          },
        });
      })
    );
    return NextResponse.json({ invitedBidders }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to invite bidders ${error}` },
      { status: 500 }
    );
  }
}
