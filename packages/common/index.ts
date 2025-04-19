export enum FRONTEND_MESSAGES {
  "START" = "START",
  "MOVE" = "MOVE",
  "QUIT" = "QUIT",
}

export enum WEBSOCKET_MESSAGES {
  "START_GAME",
  "MOVE_PIECE",
  "GAME_ENDED",
  "GAME_ABORTED",
  "ERROR",
}

export enum Modes {
  "1 min",
  "1 | 1",
  "2 | 1",
  "3 min",
  "3 | 2",
  "5 min",
  "10 min",
  "15 | 10",
  "30 min",
}

interface TimeControl {
  baseTime: number;
  increament: number;
}

export function getTime(mode: string): TimeControl {
  switch (mode) {
    case "1 min":
      return { baseTime: 1 * 60 * 1000, increament: 0 };
    case "1 | 1":
      return { baseTime: 1 * 60 * 1000, increament: 1000 };
    case "2 | 1":
      return { baseTime: 2 * 60 * 1000, increament: 1000 };
    case "3 min":
      return { baseTime: 3 * 60 * 1000, increament: 0 };
    case "3 | 2":
      return { baseTime: 3 * 60 * 1000, increament: 2 * 1000 };
    case "5 min":
      return { baseTime: 5 * 60 * 1000, increament: 0 };
    case "10 min":
      return { baseTime: 10 * 60 * 1000, increament: 0 };
    case "15 | 10":
      return { baseTime: 15 * 60 * 1000, increament: 10 * 1000 };
    case "30 min":
      return { baseTime: 30 * 60 * 1000, increament: 0 };
    default:
      return { baseTime: 0, increament: 0 };
  }
}
