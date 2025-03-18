import { getUserFromDb } from "@/actions/auth-actions";
import { SignInSchema } from "@/validators/user-validators";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signin",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = user;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user,
                };
            }
            return session;
        }
    },
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const { username, password } = await SignInSchema.parseAsync(credentials);
                    
                    const user = await getUserFromDb(username, password);
                    
                    if (!user) {
                        return null;
                    }
                    
                    return {
                        id: user._id.toString(),
                        username: user.username,
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    console.error("Authentication error: ", error);
                    return null;
                }
            }
        })
    ],
});
