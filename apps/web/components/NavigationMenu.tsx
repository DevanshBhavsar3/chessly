import Link from "next/link";
import { TypographyLarge } from "./ui/TypographyLarge";
import { TypographySmall } from "./ui/TypographySmall";

export function NavigationMenu() {
  return (
    <nav className="flex items-center justify-between p-2">
      <div>
        <TypographyLarge>Chessly</TypographyLarge>
      </div>
      <div className="flex items-center gap-5">
        <Link href={"/login"}>
          <TypographySmall>Login</TypographySmall>
        </Link>
        <Link href={"/signup"}>
          <TypographySmall>Signup</TypographySmall>
        </Link>
      </div>
    </nav>
  );
}
