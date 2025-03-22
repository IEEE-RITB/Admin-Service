import { organizerCollection } from "@/storage";
import { OrganizerSchema } from "@/validators/user-validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  console.log(requestBody,"1st point........");
  const { name, isVerified } = await OrganizerSchema.parseAsync(requestBody);
  const organizerExists = !!(await organizerCollection.findOne({ name }));
  if (organizerExists) {
    return NextResponse.json({
      status: 409,
      message: "Organizer already exists",
    });
  }
  const saveOrganizer = await organizerCollection.insertOne({
    name,
    isVerified,
  });
  console.log(saveOrganizer);
  if (!saveOrganizer.acknowledged) {
    console.log(saveOrganizer);
    return NextResponse.json({
      status: 500,
      message: "Unhandled error: Failed to create organizer",
    });
  }
  return NextResponse.json({
    status: 201,
    message: "Organizer created successfully",
  });
}
