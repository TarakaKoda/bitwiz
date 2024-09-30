import { getBidderById } from "@/lib/actions/bidder.action";
import { currentUser } from "@clerk/nextjs/server";
import CreateBidForm from "./create-bid-form";

const CreateBid = async () => {
  const user = await currentUser();
  console.log(user?.id);

  // Check if the user exists
  if (!user) return null;

  // Fetch the current bidder based on user id
  const currentBidder = await getBidderById({ clerkId: user.id });
  console.log(currentBidder?.id);

  // Ensure currentBidder exists before rendering the form
  if (!currentBidder || !currentBidder.id) {
    console.error("Current bidder not found or missing id.");
    return null;
  }

  // Pass the current bidder id to the form
  return (
    <div className="w-[20vw]">
      <CreateBidForm currentBidderId={currentBidder.id} />
    </div>
  );
};

export default CreateBid;
