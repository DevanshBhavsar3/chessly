"use client";

import { useSocket } from "@/utils/useSocket";
import { Board } from "../Board";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { useEffect, useState } from "react";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";

export function GamePage() {
  const { socket, loading, startGame, quitGame } = useSocket();
  const [fen, setFen] = useState(DEFAULT_FEN);
  const [gameDetails, setGameDetails] = useState({
    gameId: "",
    side: "",
  });

  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case WEBSOCKET_MESSAGES.START_GAME:
          setGameDetails({ gameId: message.gameId, side: message.side });
          setFen(DEFAULT_FEN);
          break;
        case WEBSOCKET_MESSAGES.MOVE_PIECE:
          setFen(message.message);
          break;
        case WEBSOCKET_MESSAGES.GAME_ENDED:
        case WEBSOCKET_MESSAGES.GAME_ABORTED:
          // TODO: Add a nice ui
          console.log("You won");
          quitGame();
          setGameDetails({ gameId: "", side: "" });
          break;
        case WEBSOCKET_MESSAGES.ERROR:
          // TODO: Add a nice ui
          alert(message.message);
          break;
        default:
          console.log(message);
          return;
      }
    };
  }

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
    if (loading) {
      return <div>Finding Opponent...</div>;
    }

    return (
      <div>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }
}
