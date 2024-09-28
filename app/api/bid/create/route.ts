import { CreateBidSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validation = CreateBidSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.message },
      { status: 400 }
    );
  }
  const { title, startTime, endTime, items, creatorId } = validation.data;
  try {
    const bid = await prisma.bid.create({
      data: {
        id: new ObjectId().toString(),
        creatorId,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        items: {
          create: items.map((items) => ({ description: items.description })),
        },
      },
    });
    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}
