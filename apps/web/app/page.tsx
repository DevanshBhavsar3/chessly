"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <button onClick={() => signIn("google")} className="bg-sky-300 p-2">
        SignIn with google
      </button>
      <Link href={"/game"}>Start Game</Link>
    </div>
  );
}
