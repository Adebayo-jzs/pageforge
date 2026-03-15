import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { compare } from "bcryptjs";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) return null;

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user || !user.password) return null;
        const valid = await compare(password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
      }
      if (account?.provider) token.provider = account.provider;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await dbConnect();
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            plan: "free",
          });
          user.id = newUser._id.toString();
          user.plan = newUser.plan;
        } else {
          user.id = existing._id.toString();
          user.plan = existing.plan;
        }
      }
      return true;
    },
  },
});