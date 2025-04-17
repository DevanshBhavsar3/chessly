import { FlipVertical2, LogOut, Maximize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Dispatch, SetStateAction } from "react";
import { GameDetails } from "@/types";

interface ToolsProps {
  setGameDetails: Dispatch<SetStateAction<GameDetails>>;
  handleExit: () => void;
  isRunning: boolean;
}

export function Tools({ setGameDetails, handleExit, isRunning }: ToolsProps) {
  function flipBoard() {
    setGameDetails((prev) => ({
      ...prev,
      side: prev.side === "w" ? "b" : "w",
    }));
  }

  //  TODO: Show tooltip
  const options = [
    {
      title: "Flip",
      icon: <FlipVertical2 size={16} />,
      onClick: flipBoard,
    },
    { title: "Maximize", icon: <Maximize2 size={16} /> },
  ];

  if (isRunning) {
    options.push({
      title: "Resign",
      icon: <LogOut size={16} />,
      onClick: handleExit,
    });
  }

  return (
    <div className="flex flex-col items-center gap-2 ml-1 mr-5">
      {options.map((options, idx) => (
        <Button key={idx} variant="icon" size="sm" onClick={options.onClick}>
          {options.icon}
        </Button>
      ))}
    </div>
  );
}
