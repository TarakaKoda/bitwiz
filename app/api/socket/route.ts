import { NextRequest, NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as NetServer } from "http";
import { Server as NetSocket } from "net";
import axios from "axios";

// Mark this API route as dynamic
export const dynamic = "force-dynamic";

// Custom response type with WebSocket support
type NextApiResponseWithSocket = NextResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

// GET handler for WebSocket API route
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(req: NextRequest) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const res = NextResponse.next() as unknown as NextApiResponseWithSocket;

  // Initialize WebSocket if not already set up
  if (!res.socket.server.io) {
    console.log("Initializing WebSocket server...");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected via WebSocket");

      // Handle bid placement event
      socket.on("placedBid", async (data) => {
        try {
          const result = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/place-bid`,
            data
          );

          if (result.status === 200) {
            const leaderboardResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/bid/leaderboard`
            );
            io.emit("updateLeaderboard", leaderboardResponse.data);
          } else {
            socket.emit("error", result.data.error);
          }
        } catch (error) {
          console.error("Error placing bid:", error);
          socket.emit("error", "Failed to place bid.");
        }
      });

      // Handle disconnection event
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } else {
    console.log("WebSocket server already initialized");
  }

  return res;
}
