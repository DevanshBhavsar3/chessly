import { PlayerDetails } from "@/types";
import { TypographySmall } from "./TypographySmall";
import Image from "next/image";
import { TypographyH3 } from "./TypographyH3";

export function PlayerCard({ player }: { player: PlayerDetails }) {
  const { minutes, seconds } = getMinutesAndSeconds(player.time);

  function getMinutesAndSeconds(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60; // Get only the seconds portion (0-59)

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  }

  return (
    <div className="flex justify-start items-center gap-2 w-full">
      {/* Player Image */}
      <Image
        src={player.image}
        alt="player"
        width={14}
        height={14}
        className="size-10"
      />
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col h-full gap-2">
          <TypographySmall>{player.name}</TypographySmall>
          <TypographySmall>{player.ratings}</TypographySmall>
        </div>
        <div className="bg-muted border border-muted-dark py-1 px-4 rounded-sm">
          <TypographyH3>
            {minutes}:{seconds}
          </TypographyH3>
        </div>
      </div>
    </div>
  );
}
