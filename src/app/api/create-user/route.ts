import { saltAndHashPassword } from "@/helpers/auth-helpers";
import { organizerCollection, usersCollection } from "@/storage";
import { CreateUserSchema } from "@/validators/user-validators";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const { username, password, organizerId } = await CreateUserSchema.parseAsync(
    requestBody
  );
  const userExists = !!(await usersCollection.findOne({ username }));
  if (userExists) {
    return NextResponse.json({
      status: 400,
      message: "User with given username already exists",
    });
  }
  const hashedPassword = await saltAndHashPassword(password);
  const organizer = await organizerCollection.findOne({
    _id: new ObjectId(organizerId),
  });
  if (!organizer) {
    return NextResponse.json({
      status: 400,
      message: "Organizer with given ID does not exist",
    });
  }
  if (!organizer.isVerified) {
    return NextResponse.json({
      status: 400,
      message: "Organizer is not verified",
    });
  }
  console.log(organizer);
  const saveUser = await usersCollection.insertOne({
    username,
    hashedPassword,
    organizerId,
  });
  if (!saveUser.acknowledged) {
    return NextResponse.json({
      status: 500,
      message: "Unhandled error: Failed to create user",
    });
  }
  return NextResponse.json({
    status: 201,
    message: "User created successfully",
  });
}
