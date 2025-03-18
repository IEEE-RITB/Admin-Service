import { z } from "zod";

export const SignInSchema = z.object({
    username: z.string({ required_error: "Username is required" })
        .min(3),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export type ISignInSchema = z.infer<typeof SignInSchema>;

export const CreateUserSchema = z.object({
    username: z.string({ required_error: "Username is required" })
        .min(3),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    organizer: z.string({ required_error: "Organizer is required" }),
});

export type ICreateUserSchema = z.infer<typeof CreateUserSchema>;
