import { saltAndHashPassword } from "@/helpers/auth-helpers";
import { usersCollection } from "@/storage";
import { CreateUserSchema } from "@/validators/user-validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const requestBody = await req.json();
    const { username, password, organizer } = await CreateUserSchema.parseAsync(requestBody);
    const userExists = !!(await usersCollection.findOne({ username }));
    if (userExists) {
        return NextResponse.json({ status: 400, message: "User with given username already exists" });
    }
    const hashedPassword = await saltAndHashPassword(password);
    const saveUser = await usersCollection.insertOne({
        username,
        hashedPassword,
        organizer,
    });
    if (!saveUser.acknowledged) {
        return NextResponse.json({ status: 500, message: "Unhandled error: Failed to create user" });
    }
    return NextResponse.json({ status: 201, message: "User created successfully" });
}
