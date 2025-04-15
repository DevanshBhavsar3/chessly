"use client";

import Image from "next/image";
import { MouseEvent, useRef } from "react";

function parseFen(fen: string) {
  let parsedFen: string = "";

  for (const char of fen) {
    const num = parseInt(char);

    if (isNaN(num)) {
      parsedFen += char;
    } else {
      for (let i = 0; i < num; i++) {
        parsedFen += " ";
      }
    }
  }

  return parsedFen;
}

function getIcon(piece: string) {
  switch (piece) {
    case "p":
      return "/pieces/pawn-b.svg";
    case "r":
      return "/pieces/rook-b.svg";
    case "n":
      return "/pieces/knight-b.svg";
    case "b":
      return "/pieces/bishop-b.svg";
    case "q":
      return "/pieces/queen-b.svg";
    case "k":
      return "/pieces/king-b.svg";
    case "P":
      return "/pieces/pawn-w.svg";
    case "R":
      return "/pieces/rook-w.svg";
    case "N":
      return "/pieces/knight-w.svg";
    case "B":
      return "/pieces/bishop-w.svg";
    case "Q":
      return "/pieces/queen-w.svg";
    case "K":
      return "/pieces/king-w.svg";
    default:
      return;
  }
}

interface BoardProps {
  fen: string;
  onMove?: (move: { from: string; to: string }) => void;
  side?: "w" | "b";
  disabled?: boolean;
  notation?: boolean;
}

export function Board({ fen, onMove, side, disabled, notation }: BoardProps) {
  const moveRef = useRef<string>("");
  const [position, turn, etc] = fen.split(" ");
  let parsedFen;

  if (side === "b") {
    parsedFen = parseFen(position).split("/").reverse();

    parsedFen = parsedFen.map((item) => item.split("").reverse().join(""));
  } else {
    parsedFen = parseFen(position).split("/");
  }

  function handleDragEnter(e: MouseEvent) {
    if (disabled) return;

    const target = e.target as HTMLElement;

    const square =
      target.dataset.square || target.parentElement?.dataset.square || "";

    moveRef.current = square;
  }

  function handleDragEnd(e: MouseEvent) {
    const target = e.target as HTMLElement;

    // Return if the piece is not of user's side
    if (target.dataset.side !== side) return;

    const parentElement = target.parentElement as HTMLElement;
    const fromSquare = parentElement.dataset.square;

    if (!disabled && onMove) {
      onMove({
        from: fromSquare || "",
        to: moveRef.current,
      });
    }
  }

  return (
    <div className="border border-muted-dark overflow-hidden aspect-square w-fit h-fit">
      <div className="grid grid-rows-8">
        {parsedFen.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-8">
            {Array.from(row).map((col, colIdx) => (
              <div
                key={colIdx}
                data-square={
                  side === "b"
                    ? String.fromCharCode(104 - colIdx) + (1 + rowIdx)
                    : String.fromCharCode(97 + colIdx) + (8 - rowIdx)
                }
                className={`relative aspect-square ${rowIdx % 2 === colIdx % 2 ? "bg-primary-dark" : "bg-muted"}`}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              >
                {notation && (
                  <p className="absolute text-xs opacity-30 p-0.5">
                    {side === "b"
                      ? String.fromCharCode(104 - colIdx) + (1 + rowIdx)
                      : String.fromCharCode(97 + colIdx) + (8 - rowIdx)}
                  </p>
                )}
                {getIcon(col) && (
                  <Image
                    src={getIcon(col) as string}
                    data-piece={col}
                    data-side={col === col.toUpperCase() ? "w" : "b"}
                    alt="piece"
                    width={10}
                    height={10}
                    className="w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
