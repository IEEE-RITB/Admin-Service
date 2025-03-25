import {
  eventsCollection,
  organizerCollection,
  usersCollection,
} from "@/storage";
import { EventSchema } from "@/validators/event-validators";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const {
    name,
    description,
    date,
    timeline,
    img,
    venue,
    theme,
    maxParticipantsPerTeam,
    prizes,
    rules,
    coordinators,
    userId,
  } = await EventSchema.parseAsync(requestBody);
  const adminUser = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!adminUser)
    return NextResponse.json({
      status: 404,
      message: "User not found",
    });
  const organizer = await organizerCollection.findOne({
    _id: new ObjectId(adminUser.organizerId),
  });
  if (!organizer) {
    return NextResponse.json({
      status: 404,
      message: "Not valid organizer",
    });
  }
  if (!organizer.isVerified) {
    return NextResponse.json({
      status: 403,
      message: "Organizer is not verified",
    });
  }

  const saveEvent = await eventsCollection.insertOne({
    name,
    description,
    date,
    timeline,
    img,
    venue,
    theme,
    maxParticipantsPerTeam,
    prizes,
    rules,
    coordinators,
    organizerId: organizer._id,
    userId,
  });
  if (!saveEvent.acknowledged) {
    return NextResponse.json({
      status: 500,
      message: "Unhandled error: Failed to create event",
    });
  }
  return NextResponse.json({
    status: 201,
    message: "Event created successfully",
  });
}
