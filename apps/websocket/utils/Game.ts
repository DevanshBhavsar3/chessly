import { getTime, Modes, WEBSOCKET_MESSAGES } from "@repo/common";
import { randomUUIDv7 } from "bun";
import { Chess, type Color } from "chess.js";
import WebSocket from "ws";

export class Game {
  public id: string;
  public white: WebSocket;
  public black: WebSocket;
  private game: Chess;
  private whiteTime: number;
  private blackTime: number;
  private increament: number;
  private lastMoveTime: number;

  constructor(player1: WebSocket, player2: WebSocket, mode: Modes) {
    this.id = randomUUIDv7("hex");
    this.white = player1;
    this.black = player2;
    this.game = new Chess();

    const time = getTime(Modes[mode] as unknown as string);
    this.whiteTime = time.baseTime;
    this.blackTime = time.baseTime;
    this.increament = time.increament;

    this.lastMoveTime = Date.now();
  }

  move(move: { from: string; to: string }) {
    const currTime = Date.now();
    const timeForMove = currTime - this.lastMoveTime;

    try {
      if (this.game.turn() === "w") {
        this.whiteTime -= timeForMove;

        if (this.whiteTime < 0) {
          this.gameover();
        }
      } else {
        this.blackTime -= timeForMove;

        if (this.blackTime < 0) {
          this.gameover();
        }
      }

      this.game.move(move);

      const currMove = this.game.turn();

      if (currMove === "w") {
        this.blackTime += this.increament;
      } else {
        this.whiteTime += this.increament;
      }

      const message = {
        type: WEBSOCKET_MESSAGES.MOVE_PIECE,
        message: this.game.fen(),
        moves: this.game.history({ verbose: true }),
      };

      this.white.send(
        JSON.stringify({
          ...message,
          time: this.whiteTime,
          opponentTime: this.blackTime,
          isMove: currMove === "w",
        })
      );
      this.black.send(
        JSON.stringify({
          ...message,
          time: this.blackTime,
          opponentTime: this.whiteTime,
          isMove: currMove === "b",
        })
      );

      if (this.game.isGameOver()) {
        this.gameover();
      }

      this.lastMoveTime = Date.now();
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
