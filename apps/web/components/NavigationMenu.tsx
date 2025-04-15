import Link from "next/link";
import { TypographyLarge } from "./ui/TypographyLarge";
import { TypographySmall } from "./ui/TypographySmall";

export function NavigationMenu() {
  return (
    <nav className="flex items-center justify-between p-2">
      <Link href={"/"}>
        <TypographyLarge>Chessly</TypographyLarge>
      </Link>
      <Link href={"/auth/login"}>
        <TypographySmall>Login</TypographySmall>
      </Link>
    </nav>
  );
}
