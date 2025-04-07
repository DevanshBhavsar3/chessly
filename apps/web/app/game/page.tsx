import { GamePage } from "@/components/game/GamePage";
import { auth } from "@/auth";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";

export default async function Game() {
  const session = await auth();

  if (!session?.user) {
    return <div>Unauthenticated.</div>;
  }

  return (
    <SessionProvider>
      <div>
        <Image
          src={session.user.image || ""}
          alt="User image"
          width={100}
          height={100}
        />
        <GamePage />
      </div>
    </SessionProvider>
  );
}
