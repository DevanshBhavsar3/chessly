"use client";

import { FRONTEND_MESSAGES, Modes, WEBSOCKET_MESSAGES } from "@repo/common";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useSession();

  useEffect(() => {
    return () => {
      quitGame();
    };
  }, [socket]);

  function startGame(mode: Modes) {
    setLoading(true);
    const socket = new WebSocket(`ws://localhost:8080?id=${data?.user?.id}`);

    socket.onopen = () => {
      setSocket(socket);

      socket.send(
        JSON.stringify({
          type: FRONTEND_MESSAGES.START,
          payload: {
            mode,
          },
        })
      );
    };
  }

  function quitGame() {
    if (!socket) return;

    if (socket.readyState === socket.OPEN) {
      socket.send(
        JSON.stringify({
          type: FRONTEND_MESSAGES.QUIT,
          userId: data?.user?.id,
        })
      );

      socket.close();
      setSocket(null);
      setLoading(false);
    }
  }

  return { socket, loading, startGame, quitGame };
}
