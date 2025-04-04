import type WebSocket from "ws";
import { MESSAGES, MessageType, movePayload } from "@repo/common";
import { Queue } from "./queue";
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

        switch (type) {
          case MESSAGES.START:
            const game = this.queue.enqueue(socket);

            if (game) {
              this.games.set(game.id, game);
            }

            break;
          case MESSAGES.MOVE:
            const { gameId, move } = movePayload.parse(JSON.parse(payload));

            console.log(`Make ${move} in ${gameId}`);
            break;
          case MESSAGES.QUIT:
            // abort if the game is running
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
