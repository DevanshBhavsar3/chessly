"use client";

import { Dispatch, SetStateAction } from "react";
import { TypographyH4 } from "../ui/TypographyH4";
import { GameDetails } from "@/types";

export function Game({
  gameDetails,
  setGameDetails,
}: {
  gameDetails: GameDetails;
  setGameDetails: Dispatch<SetStateAction<GameDetails>>;
}) {
  return (
    <div className="h-full w-1/3 px-4 py-2 rounded-sm flex flex-col border shadow-md">
      <TypographyH4>Moves</TypographyH4>
      {/* TODO: Update the UI */}
      <div className="h-1/2 rounded-sm flex gap-4">
        {gameDetails.moves.map((move, idx) => (
          <button
            key={idx}
            className="bg-muted h-fit px-1 rounded-sm"
            onClick={() =>
              setGameDetails((prev) => ({ ...prev, fen: move.after }))
            }
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
  );
}
