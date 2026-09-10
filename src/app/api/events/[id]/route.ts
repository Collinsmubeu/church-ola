import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { requirePermission, handleAuthError } from "@/lib/auth-guard";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { attendees: true, createdBy: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("event:edit");
    const { id } = await params;
    const body = await request.json();
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        location: body.location,
        capacity: body.capacity ?? undefined,
      },
      include: { attendees: true },
    });
    return NextResponse.json(event);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("event:delete");
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}