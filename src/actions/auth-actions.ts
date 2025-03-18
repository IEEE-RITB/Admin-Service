"use server";

import { signIn } from '@/lib/auth';
import { MongoDBClient } from '@/lib/mongodb';
import { usersCollection } from '@/storage';
import { ISignInSchema } from '@/validators/user-validators';
import bcrypt from 'bcryptjs';

const mongoClient = new MongoDBClient();
mongoClient.init();

export async function getUserFromDb(username: string, password: string) {
    const user = await usersCollection.findOne({ username });
    if (!user) {
        return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
        return null;
    }
    return user;
}

export async function loginUser(formData: ISignInSchema) {
    try {
        const result = await signIn("credentials", {
            username: formData.username,
            password: formData.password,
            redirect: false,
        });
        return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        if (error?.type === "CredentialsSignin") {
            return { error: "Invalid username or password. Please try again." };
        }
        console.error("Login error:", JSON.stringify(error));
        return { error: "An error occurred during sign in. Please try again." };
    }
}
