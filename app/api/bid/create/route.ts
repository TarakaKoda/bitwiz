import { CreateBidSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: NextRequest) {
  const body =  await req.json();

  const validation = CreateBidSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.message },
      { status: 400 }
    );
  }
  const { title, startTime, endTime, items } = validation.data;
  try {
    const bid = await prisma.bid.create({
      data: {
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
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}
