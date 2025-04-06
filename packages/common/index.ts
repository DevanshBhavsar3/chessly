import { z } from "zod";

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

export const MessageType = z.object({
  type: z.nativeEnum(FRONTEND_MESSAGES),
  payload: z
    .object({
      gameId: z.string(),
      move: z.string(),
    })
    .optional(),
});

export const movePayload = z.object({
  move: z.object({
    from: z.string(),
    to: z.string(),
  }),
  gameId: z.string(),
});
