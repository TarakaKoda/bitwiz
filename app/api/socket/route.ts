import { NextRequest, NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as NetServer } from "http";
import { Server as NetSocket } from "net";
import axios from "axios";

type NextApiResponseWithSocket = {
  socket: NetSocket & {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

export async function GET(req: NextRequest) {
  const res = NextResponse.next() as unknown as NextApiResponseWithSocket;

  if (!res.socket.server.io) {
    console.log("Initializing Websocket server...");
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("New client connected via Websocket");

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
          console.error("Error place bid:", error);
          socket.emit("error", "Failed to place bid.");
        }
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } else {
    console.log("Websocket server already Initialized");
  }
  return res;
}
