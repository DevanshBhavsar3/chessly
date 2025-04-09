"use client";

import { signIn } from "@/auth";
import { ModeToggle } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <div>
        <small className="text-lg font-semibold">Chessly</small>

        <Link href={"/login"}>
          <Button variant={"link"} className="cursor-pointer">
            Login
          </Button>
        </Link>

        <Link href={"/signup"}>
          <Button variant={"link"} className="cursor-pointer">
            Signup
          </Button>
        </Link>
      </div>
    </main>
  );
}

{
  /* <form
  action={async () => {
    "use server";
    await signIn("google");
  }}
>
  <button type="submit">Signin with Google</button>
</form> */
}
