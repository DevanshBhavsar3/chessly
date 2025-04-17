import { TypographySmall } from "../ui/TypographySmall";

export function Finding() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="size-5 rounded-full border-t-black/70 border-2 animate-spin" />
        <TypographySmall>Finding Opponent</TypographySmall>
      </div>
    </div>
  );
}
