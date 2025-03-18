import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const requestBody = await req.json();
    console.log(requestBody);
    return NextResponse.json({ status: 201, message: "Event created successfully" });
}
