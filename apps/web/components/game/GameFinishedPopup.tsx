"use client";

import { CircleX } from "lucide-react";
import { Button } from "../ui/Button";
import { TypographyH3 } from "../ui/TypographyH3";
import Link from "next/link";
import { PlayerCard } from "../ui/PlayerCard";
import { GameResult, PlayerDetails } from "@/types";
import { TypographyH4 } from "../ui/TypographyH4";

interface GameFinishedPopupProps {
  result: GameResult;
  closePopup: () => void;
}

export function GameFinishedPopup({
  result,
  closePopup,
}: GameFinishedPopupProps) {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/10">
      <div className="flex flex-col justify-center items-center gap-10 bg-popover p-4 border border-popover-border rounded-lg min-w-xl">
        <div className="w-full flex justify-between items-center">
          <TypographyH4>Game Finished</TypographyH4>
          <Button
            variant="icon"
            size="auto"
            className="m-2"
            onClick={closePopup}
          >
            <CircleX size={18} />
          </Button>
        </div>
        <div className="w-full flex justify-center flex-col items-center gap-5">
          <div className="mb-5">
            <TypographyH3>{result.message}</TypographyH3>
          </div>
          <PlayerCard player={result.winner} />
          <PlayerCard player={result.loser} />
        </div>
        <div className="w-full flex flex-col gap-3">
          <Link href={"/game"}>
            <Button
              variant="primary"
              className="w-full justify-center items-center"
            >
              New Game
            </Button>
          </Link>
          <Link href={"/"}>
            <Button className="w-full justify-center items-center">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
