import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sermon = await prisma.sermon.findUnique({
      where: { id },
    });
    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json(sermon);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sermon" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sermon = await prisma.sermon.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        audioUrl: body.audioUrl,
        speaker: body.speaker,
        date: body.date ? new Date(body.date) : undefined,
        duration: body.duration,
      },
    });
    return NextResponse.json(sermon);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update sermon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.sermon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete sermon" },
      { status: 500 }
    );
  }
}