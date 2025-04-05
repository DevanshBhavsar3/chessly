import { randomUUIDv7 } from "bun";
import { Chess, type Color } from "chess.js";
import type WebSocket from "ws";

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

  move(move: string) {
    try {
      this.game.move(move);

      this.white.send(move);
      this.black.send(move);

      if (this.game.isGameOver()) {
        this.gameover();
      }
    } catch (e) {
      console.log(e);
    }
  }

  gameover() {
    if (this.game.turn() === "b") {
      this.white.send("You won. Game Over");
      return;
    }

    this.black.send("You won. Game Over");
  }

  abort(side: Color) {
    // TODO: Finish the game
    if (side === "w") {
      this.black.send("Game Aborted by Opponent");
      this.black.close();
    } else if (side === "b") {
      this.white.send("Game Aborted by Opponent");
      this.white.close();
    }
  }
}
