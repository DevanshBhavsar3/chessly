"use client";

import { TypographyH4 } from "../ui/TypographyH4";
import { TypographySmall } from "../ui/TypographySmall";
import { Button } from "../ui/Button";
import { Dispatch, SetStateAction, useState } from "react";
import { Radio } from "../ui/Radio";
import { TypographyH3 } from "../ui/TypographyH3";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { TypographyLarge } from "../ui/TypographyLarge";
import { Modes } from "@repo/common";
import { GameDetails } from "@/types";

export function ModesSelector({
  gameDetails,
  setGameDetails,
  onStart,
}: {
  gameDetails: GameDetails;
  setGameDetails: Dispatch<SetStateAction<GameDetails>>;
  onStart: (mode: Modes) => void;
}) {
  const [toggle, setToggle] = useState<boolean>(false);

  const modes = [
    {
      title: "Bullet",
      icon: "",
      submodes: [Modes["1 min"], Modes["1 | 1"], Modes["2 | 1"]],
    },
    {
      title: "Blitz",
      icon: <Zap size={16} />,
      submodes: [Modes["3 min"], Modes["3 | 2"], Modes["5 min"]],
    },
    {
      title: "Rapid",
      icon: "",
      submodes: [Modes["10 min"], Modes["15 | 10"], Modes["30 min"]],
    },
  ];

  return (
    <div className="h-full space-y-4 py-2 px-4 ">
      <Button
        variant="muted"
        size="lg"
        onClick={() => setToggle(!toggle)}
        className="bg-zinc-200 border border-zinc-300 text-center py-2 rounded-md relative flex justify-center items-center w-full"
      >
        <TypographyH3>{Modes[gameDetails.mode]}</TypographyH3>
        {toggle ? (
          <ChevronUp
            size={16}
            className="absolute right-5 top-1/2 -translate-y-1/2"
          />
        ) : (
          <ChevronDown
            size={16}
            className="absolute right-5 top-1/2 -translate-y-1/2"
          />
        )}
      </Button>

      {toggle && (
        <div className="space-y-4">
          {modes.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2">
                {m.icon}
                <TypographyH4>{m.title}</TypographyH4>
              </div>
              <div className="w-full grid grid-cols-3 gap-2">
                {m.submodes.map((submode, idx) => (
                  <Radio
                    key={idx}
                    name="mode"
                    className="text-center"
                    onChange={() =>
                      setGameDetails((prev) => ({ ...prev, mode: submode }))
                    }
                    defaultChecked={submode == gameDetails.mode}
                  >
                    <TypographySmall>{Modes[submode]}</TypographySmall>
                  </Radio>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="primary"
        onClick={() => onStart(gameDetails.mode)}
        className="w-full justify-center text-center"
        type="submit"
      >
        <TypographyLarge>Play</TypographyLarge>
      </Button>
    </div>
  );
}
