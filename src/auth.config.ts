import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no database or bcrypt imports) so middleware can use it.
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const role = auth?.user?.role;
      if (path.startsWith("/admin")) return role === "ADMIN";
      if (path.startsWith("/client")) return role === "CLIENT";
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = (token.role as "ADMIN" | "CLIENT") ?? "CLIENT";
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
