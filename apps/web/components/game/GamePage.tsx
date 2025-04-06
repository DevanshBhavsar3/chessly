"use client";

import { useSocket } from "@/utils/useSocket";
import { Board } from "../Board";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { useState } from "react";

export function GamePage() {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
  );
  const [gameDetails, setGameDetails] = useState({
    gameId: "",
    side: "",
  });
  const { socket, loading } = useSocket();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!socket) {
    return <div>Socket is undefined.</div>;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case WEBSOCKET_MESSAGES.START_GAME:
        setGameDetails({ gameId: message.gameId, side: message.side });
        break;
      case WEBSOCKET_MESSAGES.MOVE_PIECE:
        setFen(message.message);
        break;
      case WEBSOCKET_MESSAGES.GAME_ENDED:
        // TODO: Add a nice ui
        console.log("You won");
        setGameDetails({ gameId: "", side: "" });
        break;
      case WEBSOCKET_MESSAGES.GAME_ABORTED:
        // TODO: Add a nice ui
        console.log("You won");
        setGameDetails({ gameId: "", side: "" });
        break;
      default:
        console.log(message);
        return;
    }
  };

  function makeMove(move: { from: string; to: string }) {
    if (!socket || !gameDetails.gameId) return;

    const message = {
      type: FRONTEND_MESSAGES.MOVE,
      payload: { move, gameId: gameDetails.gameId },
    };
    socket.send(JSON.stringify(message));
  }

  if (gameDetails.gameId) {
    return (
      <div className="h-screen w-full bg-neutral-800 text-white flex justify-center items-center">
        <Board
          fen={fen}
          onMove={makeMove}
          side={gameDetails.side as "w" | "b"}
        />
      </div>
    );
  } else {
    return <div>Finding Game...</div>;
  }
}
