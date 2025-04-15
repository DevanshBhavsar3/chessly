import { GamePage } from "@/components/game/GamePage";
import { auth } from "@/auth";

export default async function Game() {
  const session = await auth();

  if (!session) {
    return <div>Unauthenticated.</div>;
  }

  return <GamePage />;
}
