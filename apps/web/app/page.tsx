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

export default async function Home() {
  const session = await auth();

  // TODO: Make new file for the hero content
  return (
    <main className="w-full min-h-screen">
      <NavigationMenu />
      <div className="max-w-4xl mx-auto space-y-5">
        <TypographyH3>Chessly</TypographyH3>
        <div className="flex justify-between gap-5">
          <div className="flex flex-col justify-between items-start w-full">
            {session?.user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={session.user.image || "not_found"}
                    alt="profile_pic"
                    width={32}
                    height={32}
                    className="rounded-full border border-black/10"
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
            )}
            <div className="w-full flex flex-col gap-2">
              <div className="w-full space-y-1">
                <Link href={"/game"}>
                  <Button className="w-full">
                    <Image src={Chess} alt="start icon" className="invert" />
                    New Game
                  </Button>
                </Link>
                <TypographyMuted>12 Users Currently PLaying</TypographyMuted>
              </div>
              {!session && (
                <>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                    className="w-full"
                  >
                    <Button type="submit" className="w-full">
                      <UserPlus size={18} />
                      Signup
                    </Button>
                  </form>
                  <Button>
                    <LogIn size={18} />
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <Board
              fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
              disabled
            />
          </div>
        </div>
      </div>
    </main>
  );
}
