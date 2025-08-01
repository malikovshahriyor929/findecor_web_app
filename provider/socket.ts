// utils/socket.ts
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BASE_URL_FOR_SOCKET!, {
      auth: {
        token: Cookies.get("access_token"),
      },
      transports: ["websocket"],
    });
  }
  return socket;
};
