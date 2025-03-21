import { eventsCollection, usersCollection } from "@/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  const adminUser = await usersCollection.findOne({ userId });
  if (!adminUser) {
    return NextResponse.json({
      status: 404,
      message: "User not found",
    });
  }
  const Events = await eventsCollection
    .find({ organizerId: adminUser.organizerId })
    .toArray();
  if (Events.length === 0) {
    return NextResponse.json({
      status: 404,
      message: "No events found",
    });
  }
  return NextResponse.json({
    status: 200,
    message: "Events found successfully",
    data: Events,
  });
}
