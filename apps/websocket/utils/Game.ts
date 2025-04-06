import { WEBSOCKET_MESSAGES } from "@repo/common";
import { randomUUIDv7 } from "bun";
import { Chess, type Color } from "chess.js";
import WebSocket from "ws";

export class Game {
  public id: string;
  public white: WebSocket;
  public black: WebSocket;
  private game: Chess;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.id = randomUUIDv7("hex");
    this.white = player1;
    this.black = player2;
    this.game = new Chess();
  }

  move(move: { from: string; to: string }) {
    try {
      this.game.move(move);

      const message = {
        type: WEBSOCKET_MESSAGES.MOVE_PIECE,
        message: this.game.fen(),
      };

      this.white.send(JSON.stringify(message));
      this.black.send(JSON.stringify(message));

      if (this.game.isGameOver()) {
        this.gameover();
      }
    } catch (e) {
      console.log(e);
    }
  }

  gameover() {
    const message = {
      type: WEBSOCKET_MESSAGES.GAME_ENDED,
      message: "",
    };

    if (this.game.isDraw()) {
      message.message = "Game Draw.";
    } else if (this.game.turn() === "b") {
      message.message = "White won. Game Over";
    } else if (this.game.turn() === "w") {
      message.message = "Black won. Game Over";
    }

    this.white.send(JSON.stringify(message));
    this.black.send(JSON.stringify(message));

    this.white.close();
    this.black.close();
  }

  abort(side: Color) {
    const message = {
      type: WEBSOCKET_MESSAGES.GAME_ABORTED,
      message: "Game Aborted by Opponent",
    };

    if (side === "w") {
      this.black.send(JSON.stringify(message));
      this.black.close();
    } else if (side === "b") {
      this.white.send(JSON.stringify(message));
      this.white.close();
    }
  }
}
