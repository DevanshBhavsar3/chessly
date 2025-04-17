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

// TODO: ADD actual timer
// TODO: ADD fullscreen option
export function GamePage() {
  const { data: session } = useSession();

  // Add rating to users's session
  const opponent: PlayerDetails = {
    name: "Opponent",
    image: "/icons/guest.svg",
    ratings: 0,
    side: "b",
  };

  const { socket, loading, startGame, quitGame } = useSocket();
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    gameId: "",
    fen: DEFAULT_FEN,
    moves: [],
    player: {
      name: session?.user?.name || "You",
      image: session?.user?.image || "/icons/guest.svg",
      ratings: 0,
      side: "w",
    },
    opponent,
    side: "w",
  });

  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case WEBSOCKET_MESSAGES.START_GAME:
          setGameDetails((prev) => ({
            ...prev,
            gameId: message.gameId,
            side: message.side,
            fen: DEFAULT_FEN,
            moves: [],
            player: { ...prev.player, side: message.side },
          }));
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
          setGameDetails((prev) => ({
            ...prev,
            gameId: "",
            side: "w",
            fen: DEFAULT_FEN,
            moves: [],
          }));
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

  function exitGame() {
    setGameDetails((prev) => ({
      ...prev,
      gameId: "",
      side: "w",
      fen: DEFAULT_FEN,
      moves: [],
    }));
    quitGame();
  }

  return (
    <div className="select-none items-center flex justify-between gap-3 w-full h-screen p-4 overflow-hidden">
      <div className="rounded-sm overflow-hidden w-2/3 h-fit flex gap-2 items-start justify-center">
        <Board
          fen={gameDetails.fen}
          side={gameDetails.side}
          player={gameDetails.player}
          opponent={gameDetails.opponent}
          notation
          onMove={makeMove}
        />
        <Tools
          setGameDetails={setGameDetails}
          handleExit={exitGame}
          isRunning={gameDetails.gameId && socket ? true : false}
        />
      </div>

      <div className="w-1/3 h-full bg-muted border border-muted-dark rounded-md">
        {socket && gameDetails.gameId ? (
          <Game gameDetails={gameDetails} setGameDetails={setGameDetails} />
        ) : loading ? (
          <Finding />
        ) : (
          <Modes onStart={startGame} />
        )}
      </div>
    </div>
  );
}
