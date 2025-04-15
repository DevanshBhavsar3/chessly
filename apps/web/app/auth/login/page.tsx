import { signIn } from "@/auth";
import { GoogleButton } from "@/components/auth/Google";
import { TypographyH4 } from "@/components/ui/TypographyH4";

export default function AuthPage() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <TypographyH4>Login</TypographyH4>
      <form
        className="bg-muted p-2 py-10 w-1/4 rounded-md text-center space-y-3 flex flex-col items-center justify-center"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <GoogleButton />
      </form>
    </div>
  );
}
