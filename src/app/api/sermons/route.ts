import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sermon = await prisma.sermon.create({
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        audioUrl: body.audioUrl,
        speaker: body.speaker,
        date: new Date(body.date),
        duration: body.duration,
      },
    });
    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}