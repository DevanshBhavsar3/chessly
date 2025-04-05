import { z } from "zod";

export enum MESSAGES {
  "START" = "START",
  "MOVE" = "MOVE",
  "QUIT" = "QUIT",
}

export const MessageType = z.object({
  type: z.nativeEnum(MESSAGES),
  payload: z
    .object({
      gameId: z.string(),
      move: z.string(),
    })
    .optional(),
});

export const movePayload = z.object({
  move: z.string(),
  gameId: z.string(),
});
