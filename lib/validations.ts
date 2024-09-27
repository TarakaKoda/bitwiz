import { date, z } from "zod";

export const CreateBidSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be 100 characters or less" }),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start time format",
    }),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end time format",
    }),
  items: z.array(
    z.object({
      description: z
        .string()
        .min(1, { message: "Item description is required" })
        .max(250, {
          message: "Item description must be 250 characters or less",
        }),
    })
  ),
});

export const InviteBiddersSchema = z.object({
  bidId: z.string(),
  bidders: z.array(
    z.object({
      name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(30, { message: "Name must be 30 characters or less" }),
      email: z.string().email(),
    })
  ),
});

export const PlaceBidSchema = z.object({
  bidderId: z.string(),
  bidItemId: z.string(),
  bids: z
    .array(
      z.object({
        bidItemId: z.string(),
        amount: z.number().min(0, { message: "Bid amount must be positive" }),
      })
    )
    .min(1, { message: "At least one bit must be placed" }),
});
