import { signIn } from "@/auth";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>

      <Link href={"/game"}>Start Game</Link>
    </div>
  );
}
