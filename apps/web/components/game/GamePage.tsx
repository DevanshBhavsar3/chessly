"use client";

import { useSocket } from "@/utils/useSocket";
import { Board } from "../Board";
import {
  FRONTEND_MESSAGES,
  GameOverMessage,
  getTime,
  Modes,
  WEBSOCKET_MESSAGES,
} from "@repo/common";
import { useEffect, useState } from "react";
import { GameDetails, GameResult } from "@/types";
import { useSession } from "next-auth/react";
import { Finding } from "./Finding";
import { Game } from "./Game";
import { ModesSelector } from "./Modes";
import { DEFAULT_FEN } from "@/utils/constant";
import { Tools } from "./Tools";
import { GameFinishedPopup } from "./GameFinishedPopup";

// TODO: ADD fullscreen option
// TODO: BUG: Sometimes the userID is undefined when connecting to the socket
// TODO: ADD Rating
export function GamePage() {
  const { data: session } = useSession();

  const { socket, loading, startGame, quitGame } = useSocket();

  const [gameDetails, setGameDetails] = useState<GameDetails>({
    gameId: "",
    mode: Modes["10 min"],
    fen: DEFAULT_FEN,
    moves: [],
    isMove: false,
    player: {
      name: session?.user?.name || "You",
      image: session?.user?.image || "/icons/guest.svg",
      ratings: 0,
      side: "w",
      time: 0,
    },
    opponent: {
      name: "Opponent",
      image: "/icons/guest.svg",
      ratings: 0,
      side: "b",
      time: 0,
    },
    side: "w",
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const time = getTime(Modes[gameDetails.mode] as unknown as string).baseTime;

    setGameDetails((prev) => ({
      ...prev,
      player: { ...prev.player, time },
      opponent: { ...prev.opponent, time },
    }));
  }, [gameDetails.mode]);

  if (socket) {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case WEBSOCKET_MESSAGES.START_GAME:
          setGameDetails((prev) => ({
            ...prev,
            gameId: message.gameId,
            side: message.side,
            isMove: message.isMove,
            fen: DEFAULT_FEN,
            moves: [],
            player: { ...prev.player, side: message.side, time: message.time },
            opponent: { ...prev.opponent, time: message.time },
          }));
          break;
        case WEBSOCKET_MESSAGES.MOVE_PIECE:
          setGameDetails((prev) => ({
            ...prev,
            fen: message.message,
            moves: message.moves,
            player: { ...prev.player, time: message.time },
            opponent: { ...prev.opponent, time: message.opponentTime },
            isMove: message.isMove,
          }));
          break;
        case WEBSOCKET_MESSAGES.GAME_ENDED:
        case WEBSOCKET_MESSAGES.GAME_ABORTED:
          const typedMessage: GameOverMessage = message;
          const result: GameResult = {
            message: message.message,
            winningSide: typedMessage.winningSide,
            winner: gameDetails.player,
            loser: gameDetails.opponent,
          };

          if (gameDetails.player.side === typedMessage.winningSide) {
            result.winner = gameDetails.player;
            result.loser = gameDetails.opponent;
          } else {
            result.winner = gameDetails.opponent;
            result.loser = gameDetails.player;
          }

          // quitGame();
          setGameResult(result);

          // Don't reset the details until the user quits the page
          setGameDetails((prev) => ({
            ...prev,
            gameId: "",
            side: "w",
            fen: DEFAULT_FEN,
            time: 10 * 60 * 1000,
            moves: [],
            player: { ...prev.player, time: 0 },
            opponent: { ...prev.opponent, time: 0 },
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

  function exitGame(message: string) {
    setGameDetails((prev) => ({
      ...prev,
      gameId: "",
      side: "w",
      fen: DEFAULT_FEN,
      moves: [],
      player: { ...prev.player, time: 0 },
    }));

    if (gameDetails.player.side == "w") {
      quitGame("White " + message);
    } else {
      quitGame("Black " + message);
    }
  }

  return (
    <div className="select-none items-center flex justify-between gap-3 w-full h-screen p-4 overflow-hidden">
      <div className="rounded-sm overflow-hidden w-2/3 h-fit flex gap-2 items-start justify-center">
        <Board
          disabled={gameDetails.gameId ? false : true}
          gameDetails={gameDetails}
          setGameDetails={setGameDetails}
          notation
          onMove={makeMove}
          handleExit={exitGame}
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
          <ModesSelector
            gameDetails={gameDetails}
            setGameDetails={setGameDetails}
            onStart={startGame}
          />
        )}
      </div>

      {gameResult && (
        <GameFinishedPopup
          result={gameResult}
          closePopup={() => setGameResult(null)}
        />
      )}
    </div>
  );
}
