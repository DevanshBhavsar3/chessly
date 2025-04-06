import type WebSocket from "ws";
import { FRONTEND_MESSAGES, WEBSOCKET_MESSAGES } from "@repo/common";
import { Queue } from "./Queue";
import type { Game } from "./Game";

export class SocketManager {
  private queue: Queue;
  private sockets: WebSocket[];
  private games = new Map<string, Game>();

  constructor() {
    this.sockets = [];
    this.queue = new Queue();
  }

  join(socket: WebSocket) {
    this.sockets.push(socket);
    this.handleMessage(socket);
  }

  handleMessage(socket: WebSocket) {
    socket.on("message", (event) => {
      try {
        const message = JSON.parse(event.toString());

        switch (message.type) {
          case FRONTEND_MESSAGES.START:
            console.log("User tried to start a game");
            const newGame = this.queue.enqueue(socket);

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
            console.log("User tried to quit.");

            this.games.forEach((g) => {
              if (g.white === socket) {
                g.abort("w");
              } else if (g.black === socket) {
                g.abort("b");
              }
            });

            this.queue.remove(socket);
            this.exit(socket);
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

  exit(socket: WebSocket) {
    this.sockets = this.sockets.filter((s) => s !== socket);
    socket.close();
  }
}
