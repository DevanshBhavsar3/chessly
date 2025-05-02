import type WebSocket from "ws";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { Queue } from "./Queue";
import type { Game } from "./Game";

export class SocketManager {
  private queue: Queue;
  private sockets: Map<string, WebSocket>;
  private games: Map<string, Game>;

  constructor() {
    this.sockets = new Map<string, WebSocket>();
    this.games = new Map<string, Game>();
    this.queue = new Queue();
  }

  join(socket: WebSocket, userId: string) {
    this.sockets.set(userId, socket);
    this.handleMessage(userId);
  }

  handleMessage(userId: string) {
    const socket = this.sockets.get(userId);

    if (!socket) {
      return;
    }

    socket.on("message", (event) => {
      try {
        const message = JSON.parse(event.toString());

        switch (message.type) {
          case FRONTEND_MESSAGES.START:
            const { mode } = message.payload;
            const newGame = this.queue.enqueue(socket, userId, mode);

            if (newGame) {
              this.games.set(newGame.id, newGame);
            }

            break;
          case FRONTEND_MESSAGES.MOVE:
            const { gameId, move } = message.payload;

            const game = this.games.get(gameId);

            if (!game) {
              socket.send(
                JSON.stringify({
                  type: WEBSOCKET_MESSAGES.ERROR,
                  message: "Invalid Game Id.",
                })
              );
              return;
            }

            game.move(move);
            break;
          case FRONTEND_MESSAGES.QUIT:
            this.games.forEach((g) => {
              if (g.white === socket) {
                g.abort("w", message.message);
              } else if (g.black === socket) {
                g.abort("b", message.message);
              }
            });

            this.queue.remove(userId);
            this.exit(socket, message.userId);
            break;
          default:
            throw new Error("Invalid Message.");
        }
      } catch (e) {
        socket.send(
          JSON.stringify({
            type: WEBSOCKET_MESSAGES.ERROR,
            message: e,
          })
        );
      }
    });
  }

  exit(socket: WebSocket, userId: string) {
    this.sockets.delete(userId);
    socket.close();
  }
}
