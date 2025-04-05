import Image from "next/image";

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

export function Board({ fen }: { fen: string }) {
  const [position, turn, etc] = fen.split(" ");
  const parsedFen = parseFen(position).split("/");

  return (
    <div className="">
      {turn === "b" ? "Black's Turn" : "White's Turn"}

      {parsedFen.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {Array.from(row).map((col, colIdx) => (
            <div
              key={colIdx}
              className={`w-16 h-16 ${rowIdx % 2 === colIdx % 2 ? "bg-neutral-200" : "bg-neutral-600"} border border-neutral-700`}
            >
              {getIcon(col) && (
                <Image
                  src={getIcon(col) as string}
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
  );
}
