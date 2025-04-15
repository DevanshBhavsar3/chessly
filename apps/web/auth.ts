import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@repo/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub || "";

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
