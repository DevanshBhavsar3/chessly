import { GamePage } from "@/components/game/GamePage";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Game() {
  const session = await auth();

  if (!session) {
    return <div>Unauthenticated.</div>;
  }

  return (
    <div>
      {session.user && (
        <Image
          src={session.user.image || ""}
          alt="User image"
          width={100}
          height={100}
        />
      )}
      <GamePage />
    </div>
  );
}
