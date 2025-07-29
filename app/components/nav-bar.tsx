import { getBidderById } from "@/lib/actions/bidder.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const NavBar = async () => {
  const user = await currentUser();
  if (!user) return null;
  const currentBidder = await getBidderById({ clerkId: user?.id });

  return (
    <div className="w-full bg-[#060606] gap-5 flex p-5 justify-end items-center">
      <p className="uppercase text-xs">{currentBidder?.name}</p>
      <UserButton />
    </div>
  );
};

export default NavBar;
