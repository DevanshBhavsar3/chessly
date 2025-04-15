"use client";

import { useSocket } from "@/utils/useSocket";
import { Board } from "../Board";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { useState } from "react";
import { TypographyH4 } from "../ui/TypographyH4";
import { TypographyH3 } from "../ui/TypographyH3";
import { TypographyLarge } from "../ui/TypographyLarge";
import { Button } from "../ui/Button";
import { TypographySmall } from "../ui/TypographySmall";
import { Radio } from "../ui/Radio";
import { FlipVertical2, LogOut, Maximize2 } from "lucide-react";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
const modes = [
  { title: "Bullet", icon: "", submodes: ["1 min", "1 | 1", "2 | 1"] },
  { title: "Blitz", icon: "", submodes: ["3 min", "3 | 2", "5 min"] },
  { title: "Rapid", icon: "", submodes: ["10 min", "15 | 10", "30 min"] },
];

const options = [
  { title: "Resign", icon: <LogOut size={16} /> },
  { title: "Draw", icon: "" },
  { title: "Flip", icon: <FlipVertical2 size={16} /> },
  { title: "Maximize", icon: <Maximize2 size={16} /> },
];

interface move {
  before: string;
  after: string;
  color: string;
  piece: string;
  from: string;
  to: string;
  san: string;
  lan: string;
  captured?: string;
}

export function GamePage() {
  const [moves, setMoves] = useState<move[]>([]);
  const [mode, setMode] = useState<string>("10 min");
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
          setMoves(message.moves);
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

  if (gameDetails.gameId) {
    return (
      <div className="select-none flex justify-between items-center h-screen p-2 overflow-hidden w-full">
        <div className="rounded-sm overflow-hidden w-2/3 h-fit flex">
          <Board
            fen={fen}
            onMove={makeMove}
            side={gameDetails.side as "w" | "b"}
            notation
          />
          {/* TODO: Show tooltip */}
          <div className="flex flex-col items-center gap-2 ml-1 mr-5">
            {options.map((options, idx) => (
              <Button key={idx} variant="muted" size="sm">
                {options.icon}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-full w-1/3 px-4 py-2 rounded-sm flex flex-col border shadow-md">
          <TypographyH4>Moves</TypographyH4>
          {/* TODO: Update the UI */}
          <div className="h-1/2 rounded-sm flex gap-4">
            {moves.map((move, idx) => (
              <button
                key={idx}
                className="bg-muted h-fit px-1 rounded-sm"
                onClick={() => setFen(move.after)}
              >
                {move.san}
              </button>
            ))}
          </div>
          <TypographyH4>Chat</TypographyH4>
          <div className="flex-1 rounded-sm flex justify-end-safe items-center">
            <div className="flex w-full items-center justify-between">
              <input className="w-full border border-muted-dark"></input>
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    if (loading) {
      return <div>Finding Opponent...</div>;
    }

    return (
      <div className="flex justify-between gap-3 w-full h-screen p-4 overflow-hidden">
        <div className="rounded-sm overflow-hidden aspect-square">
          <Board fen={DEFAULT_FEN} />
        </div>
        <div className="w-1/4 space-y-4">
          <div className="space-y-4">
            {modes.map((modes, idx) => (
              <div key={idx} className="space-y-1">
                {/* TODO: Add Icon */}
                <TypographyH4>{modes.title}</TypographyH4>
                <div className="w-full grid grid-cols-3 gap-2">
                  {modes.submodes.map((submode, idx) => (
                    <Radio
                      key={idx}
                      name="mode"
                      className="text-center"
                      onChange={() => setMode(submode)}
                      defaultChecked={submode == mode}
                    >
                      <TypographySmall>{submode}</TypographySmall>
                    </Radio>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={() => startGame(mode)}
            className="w-full justify-center text-center"
            type="submit"
          >
            <TypographySmall>Play</TypographySmall>
          </Button>
        </div>
      </div>
    );
  }
}
