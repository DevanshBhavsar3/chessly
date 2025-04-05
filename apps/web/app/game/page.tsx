import { Board } from "@/components/Board";

export default function Game() {
  return (
    <div className="h-screen w-full bg-neutral-800 text-white flex justify-center items-center">
      <Board fen="8/8/3p4/1p1Pp1kp/pP2Pp1P/P4P1K/8/8 w - - 99 50" />
    </div>
  );
}
