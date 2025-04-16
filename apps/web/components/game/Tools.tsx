import { FlipVertical2, LogOut, Maximize2 } from "lucide-react";
import { Button } from "../ui/Button";

export function Tools() {
  //  TODO: Show tooltip
  const options = [
    { title: "Resign", icon: <LogOut size={16} /> },
    { title: "Draw", icon: "" },
    { title: "Flip", icon: <FlipVertical2 size={16} /> },
    { title: "Maximize", icon: <Maximize2 size={16} /> },
  ];

  return (
    <div className="flex flex-col items-center gap-2 ml-1 mr-5">
      {options.map((options, idx) => (
        <Button key={idx} variant="muted" size="sm">
          {options.icon}
        </Button>
      ))}
    </div>
  );
}
