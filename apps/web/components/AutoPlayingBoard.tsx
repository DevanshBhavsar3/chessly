"use client";

import { useEffect, useState } from "react";
import { Board } from "./Board";
import { Chess } from "chess.js";

export function AutoPlayingBoard() {
  const [fen, setFen] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
  );

  const game = new Chess();

  useEffect(() => {
    const timer = setInterval(() => {
      const possibleMoves = game.moves();

      if (game.isGameOver()) return;

      const randomIdx = Math.floor(Math.random() * possibleMoves.length);
      game.move(possibleMoves[randomIdx]);
      setFen(game.fen());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Board fen={fen} disabled />;
}
