import type WebSocket from "ws";
import { MESSAGES, MessageType, movePayload } from "@repo/common";
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

        const { type, payload } = MessageType.parse(message);
        console.log(payload);

        switch (type) {
          case MESSAGES.START:
            const newGame = this.queue.enqueue(socket);

            if (newGame) {
              this.games.set(newGame.id, newGame);
            }

            break;
          case MESSAGES.MOVE:
            if (!payload) return;

            const { gameId, move } = payload;

            const game = this.games.get(gameId);

            if (!game) {
              socket.send("Invalid Game Id.");
              return;
            }

            game.move(move);
            break;
          case MESSAGES.QUIT:
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
        socket.send(JSON.stringify(e));
      }
    });
  }

  exit(socket: WebSocket) {
    this.sockets = this.sockets.filter((s) => s !== socket);
    socket.close();
  }
}
