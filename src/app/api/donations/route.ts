import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const where: any = {};
    if (type) where.type = type;
    const donations = await prisma.donation.findMany({
      where,
      include: { donor: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const donation = await prisma.donation.create({
      data: {
        amount: body.amount,
        currency: body.currency || "USD",
        type: body.type || "ONE_TIME",
        note: body.note,
        donorId: body.donorId,
      },
      include: { donor: true },
    });
    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}