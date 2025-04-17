export interface PlayerDetails {
  name: string;
  ratings: number;
  image: string;
  side: "w" | "b";
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
  gameId: string;
  side: "w" | "b";
  fen: string;
  moves: Move[];
  player: PlayerDetails;
  opponent: PlayerDetails;
}
