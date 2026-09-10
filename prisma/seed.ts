import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@churchola.com" },
    update: {},
    create: {
      name: "Pastor Admin",
      email: "admin@churchola.com",
      password,
      role: "ADMIN",
    },
  });

  const pastor = await prisma.user.upsert({
    where: { email: "pastor@churchola.com" },
    update: {},
    create: {
      name: "Pastor James",
      email: "pastor@churchola.com",
      password,
      role: "PASTOR",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@churchola.com" },
    update: {},
    create: {
      name: "Sarah Member",
      email: "member@churchola.com",
      password,
      role: "MEMBER",
    },
  });

  const now = new Date();

  const event1 = await prisma.event.upsert({
    where: { id: "seed-event-1" },
    update: {},
    create: {
      id: "seed-event-1",
      title: "Sunday Worship Service",
      description: "Join us for our weekly Sunday worship service with Pastor James.",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()) % 7 || 7, 10, 0, 0),
      time: "10:00 AM",
      location: "Main Sanctuary, 123 Faith Avenue",
      capacity: 200,
      createdById: pastor.id,
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: "seed-event-2" },
    update: {},
    create: {
      id: "seed-event-2",
      title: "Community Food Drive",
      description: "Help us collect non-perishable food items for the local shelter.",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 9, 0, 0),
      time: "9:00 AM",
      location: "Church Fellowship Hall",
      capacity: 50,
      createdById: admin.id,
    },
  });

  await prisma.attendee.upsert({
    where: { id: "seed-attendee-1" },
    update: {},
    create: {
      id: "seed-attendee-1",
      name: "Sarah Member",
      email: "member@churchola.com",
      eventId: event1.id,
    },
  });

  await prisma.sermon.upsert({
    where: { id: "seed-sermon-1" },
    update: {},
    create: {
      id: "seed-sermon-1",
      title: "Walking in Faith",
      description: "A sermon about trusting God's promises even when things look impossible.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      speaker: "Pastor James",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 10, 0, 0),
      duration: 2430,
    },
  });

  await prisma.sermon.upsert({
    where: { id: "seed-sermon-2" },
    update: {},
    create: {
      id: "seed-sermon-2",
      title: "The Love of Christ",
      description: "Exploring the depth of Christ's love for humanity.",
      videoUrl: "https://www.youtube.com/embed/jN0J1qL0Z0M",
      speaker: "Pastor James",
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14, 10, 0, 0),
      duration: 2700,
    },
  });

  await prisma.donation.deleteMany({});
  await prisma.donation.createMany({
    data: [
      { amount: 100, currency: "USD", type: "ONE_TIME", note: "Weekly offering", donorId: member.id },
      { amount: 50, currency: "USD", type: "RECURRING", note: "Monthly support", donorId: member.id },
      { amount: 250, currency: "USD", type: "OFFERING", note: "Harvest offering", donorId: null },
    ],
  });

  await prisma.volunteerRole.deleteMany({});
  await prisma.volunteerRole.createMany({
    data: [
      { team: "Worship", role: "Lead Vocalist", userId: member.id, active: true },
      { team: "Usher", role: "Head Usher", userId: pastor.id, active: true },
      { team: "Children", role: "Teacher", userId: member.id, active: false },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });