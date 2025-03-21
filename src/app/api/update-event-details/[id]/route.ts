import {
  eventsCollection,
  organizerCollection,
  usersCollection,
} from "@/storage";
import { updateEventSchema } from "@/validators/event-validators";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const pathSegments = request.nextUrl.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  if (!id) {
    return NextResponse.json({
      status: 404,
      message: "Id not found",
    });
  }
  const requestBody = await request.json();
  console.log(requestBody);
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
  } = await updateEventSchema.parseAsync(requestBody);

  const adminUser = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!adminUser) {
    return NextResponse.json({
      status: 404,
      message: "User not found",
    });
  }
  const organizer = await organizerCollection.findOne({
    _id: new ObjectId(adminUser.organizerId),
  });
  if (!organizer) {
    return NextResponse.json({
      status: 404,
      message: "Organizer not found",
    });
  }
  const updatedEvent = await eventsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
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
      },
    }
  );
  if (!updatedEvent) {
    return NextResponse.json({
      status: 404,
      message: "Event not found",
    });
  }
  return NextResponse.json({
    status: 200,
    message: "Event updated successfully",
  });
}
