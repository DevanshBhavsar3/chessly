import { Modes } from "@repo/common";

export interface PlayerDetails {
  name: string;
  ratings: number;
  image: string;
  side: "w" | "b";
  time: number;
}

interface Move {
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

export interface GameDetails {
  mode: Modes;
  gameId: string;
  isMove: boolean;
  side: "w" | "b";
  fen: string;
  moves: Move[];
  player: PlayerDetails;
  opponent: PlayerDetails;
}
