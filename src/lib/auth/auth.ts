import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

const nextAuthInstance = NextAuth(() => authOptions);

export const handlers = nextAuthInstance.handlers;
export const auth = nextAuthInstance.auth;