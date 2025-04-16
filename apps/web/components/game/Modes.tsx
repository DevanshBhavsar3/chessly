"use client";

import { TypographyH4 } from "../ui/TypographyH4";
import { TypographySmall } from "../ui/TypographySmall";
import { Button } from "../ui/Button";
import { useState } from "react";
import { Radio } from "../ui/Radio";

export function Modes({ onStart }: { onStart: (mode: string) => void }) {
  const [mode, setMode] = useState<string>("10 min");

  const modes = [
    { title: "Bullet", icon: "", submodes: ["1 min", "1 | 1", "2 | 1"] },
    { title: "Blitz", icon: "", submodes: ["3 min", "3 | 2", "5 min"] },
    { title: "Rapid", icon: "", submodes: ["10 min", "15 | 10", "30 min"] },
  ];

  return (
    <div className="w-1/3 space-y-4 bg-muted py-2 px-4 rounded-md">
      <div className="space-y-4">
        {modes.map((modes, idx) => (
          <div key={idx} className="space-y-1">
            {/* TODO: Add Icon */}
            <TypographyH4>{modes.title}</TypographyH4>
            <div className="w-full grid grid-cols-3 gap-2">
              {modes.submodes.map((submode, idx) => (
                <Radio
                  key={idx}
                  name="mode"
                  className="text-center"
                  onChange={() => setMode(submode)}
                  defaultChecked={submode == mode}
                >
                  <TypographySmall>{submode}</TypographySmall>
                </Radio>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="primary"
        onClick={() => onStart(mode)}
        className="w-full justify-center text-center"
        type="submit"
      >
        <TypographySmall>Play</TypographySmall>
      </Button>
    </div>
  );
}
