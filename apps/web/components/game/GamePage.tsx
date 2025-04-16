"use client";

import { useSocket } from "@/utils/useSocket";
import { Board } from "../Board";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { useState } from "react";
import { GameDetails, PlayerDetails } from "@/types";
import { useSession } from "next-auth/react";
import { Finding } from "./Finding";
import { Game } from "./Game";
import { Modes } from "./Modes";
import { DEFAULT_FEN } from "@/utils/constant";
import { Tools } from "./Tools";

export function GamePage() {
  const { data: session } = useSession();

  // Add rating to users's session
  const player: PlayerDetails = {
    name: session?.user?.name || "",
    image: session?.user?.image || "",
    ratings: 0,
  };

  const opponent: PlayerDetails = {
    name: "Opponent",
    image: "",
    ratings: 0,
  };

  const { socket, loading, startGame, quitGame } = useSocket();
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    gameId: "",
    fen: DEFAULT_FEN,
    side: "w",
    moves: [],
    player,
    opponent,
  });

  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case WEBSOCKET_MESSAGES.START_GAME:
          setGameDetails({
            gameId: message.gameId,
            side: message.side,
            fen: DEFAULT_FEN,
            moves: [],
          });
          break;
        case WEBSOCKET_MESSAGES.MOVE_PIECE:
          setGameDetails((prev) => ({
            ...prev,
            fen: message.message,
            moves: message.moves,
          }));
          break;
        case WEBSOCKET_MESSAGES.GAME_ENDED:
        case WEBSOCKET_MESSAGES.GAME_ABORTED:
          // TODO: Add a nice ui
          console.log("You won");
          quitGame();
          setGameDetails({
            gameId: "",
            side: "w",
            fen: DEFAULT_FEN,
            moves: [],
          });
          break;
        case WEBSOCKET_MESSAGES.ERROR:
          // TODO: Add a nice ui
          console.log(message.message);
          // alert(JSON.stringify(message.message));
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

  return (
    <div className="select-none items-center flex justify-between gap-3 w-full h-screen p-4 overflow-hidden">
      <div className="rounded-sm overflow-hidden w-2/3 h-fit flex">
        <Board
          fen={gameDetails.fen}
          side={gameDetails.side}
          player={player}
          opponent={gameDetails.opponent}
          notation
          onMove={makeMove}
        />
        <Tools />
      </div>

      {socket && gameDetails.gameId ? (
        <Game gameDetails={gameDetails} setGameDetails={setGameDetails} />
      ) : loading ? (
        <Finding />
      ) : (
        <Modes onStart={startGame} />
      )}
    </div>
  );
}
