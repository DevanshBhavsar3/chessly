import { PlayerDetails } from "@/types";
import { TypographySmall } from "./TypographySmall";
import Image from "next/image";

export function PlayerCard({ player }: { player: PlayerDetails }) {
  return (
    <div className="flex justify-start items-center gap-2">
      {/* Player Image */}
      <Image
        src={player.image || "/icons/guest.svg"}
        alt="player"
        width={14}
        height={14}
        className="size-10"
      />
      <div className="flex flex-col h-full gap-2">
        <TypographySmall>{player.name}</TypographySmall>
        <TypographySmall>{player.ratings}</TypographySmall>
      </div>
    </div>
  );
}
