import { FRONTEND_MESSAGES } from "@repo/common";
import { useEffect, useState } from "react";

export function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: FRONTEND_MESSAGES.START,
        })
      );

      setSocket(socket);
      setLoading(false);
    };

    return () => {
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({
            type: FRONTEND_MESSAGES.QUIT,
          })
        );

        socket.close();
        setSocket(null);
        setLoading(true);
      }
    };
  }, []);

  return { socket, loading };
}
