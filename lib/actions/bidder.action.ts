"use server";

import { prisma } from "@/prisma/client";
import { Bidder } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getBidderById(params: { clerkId: string }) {
  try {
    const { clerkId } = params;
    const user = await prisma.bidder.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function createBidder(bidderParams: Bidder) {
  try {
    const newBidder = await prisma.bidder.create({
      data: bidderParams,
    });
    return newBidder;
  } catch (error) {
    throw error;
  }
}

export async function updateBidder(updateBidderParams: {
  clerkId: string;
  updatedData: {
    name: string;
    email: string;
    picture: string;
    accepted: boolean;
    bidId: string;
  };
}) {
  const { clerkId, updatedData } = updateBidderParams;
  await prisma.bidder.update({
    where: {
      clerkId,
    },
    data: updatedData,
  });

  revalidatePath("/");
}

export async function deleteBidder(deleteBidderParams: { clerkId: string }) {
  const { clerkId } = deleteBidderParams;

  const bidder = await prisma.bidder.findUnique({
    where: {
      clerkId,
    },
  });

  if (!bidder) {
    throw new Error("Bidder not found");
  }

  await prisma.bid.deleteMany({ where: { creatorId: bidder.id } });

  const deletedBidder = await prisma.bidder.delete({
    where: { id: bidder.id },
  });
  return deletedBidder;
}
