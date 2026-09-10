import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getEvents } from "@/lib/db/queries/events";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const upcoming = searchParams.get("upcoming") !== "false";
    const events = await getEvents(limit, upcoming);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        capacity: body.capacity ?? undefined,
      },
      include: { attendees: true },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}