import { Board } from "@/components/Board";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/Button";
import { TypographyH3 } from "@/components/ui/TypographyH3";
import { TypographyH4 } from "@/components/ui/TypographyH4";
import { LogIn, Trophy, UserPlus } from "lucide-react";
import Chess from "@/public/icons/Chess.svg";
import Image from "next/image";
import { auth, signIn } from "@/auth";
import { TypographyMuted } from "@/components/ui/TypographyMuted";
import Link from "next/link";
import { TypographySmall } from "@/components/ui/TypographySmall";
import { TypographyLarge } from "@/components/ui/TypographyLarge";
import { AutoPlayingBoard } from "@/components/AutoPlayingBoard";

export default async function Home() {
  const session = await auth();

  // TODO: Make new file for the hero content
  return (
    <main className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto space-y-5 min-h-screen flex items-center justify-center">
        <div className="flex justify-between gap-5">
          <div className="flex flex-col justify-between items-start w-full">
            {session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={session.user.image || "not_found"}
                    alt="profile_pic"
                    width={44}
                    height={44}
                    className="rounded-full border border-border"
                  />
                  <TypographyH4>{session.user.name}</TypographyH4>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy size={52} />
                  <TypographyH3>
                    <p>Rating</p>
                    <p>1024</p>
                  </TypographyH3>
                </div>
              </div>
            ) : (
              <div className="w-full h-full overflow-hidden space-y-3">
                <TypographyLarge>Currently Playing</TypographyLarge>
                <div className="flex items-center border border-muted-dark rounded-md h-14 w-full overflow-hidden">
                  <div className="bg-muted-dark h-full w-1/3">Hi</div>
                  <div className="flex flex-col items-start justify-center m-2">
                    <TypographySmall>CluxOP (123)</TypographySmall>
                    <TypographyMuted>vs</TypographyMuted>
                    <TypographySmall>CluxOP (456)</TypographySmall>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full flex flex-col gap-2">
              <Link href={"/game"}>
                <Button className="w-full" variant="primary">
                  <Image src={Chess} alt="start icon" className="dark:invert" />
                  New Game
                </Button>
              </Link>
              {!session && (
                <Link href={"/auth/login"}>
                  <Button className="w-full">
                    <UserPlus size={18} />
                    Login
                  </Button>
                </Link>
              )}
              <TypographyMuted>12 PLaying Now</TypographyMuted>
            </div>
          </div>
          {/* <AutoPlayingBoard /> */}
        </div>
      </div>
    </main>
  );
}
