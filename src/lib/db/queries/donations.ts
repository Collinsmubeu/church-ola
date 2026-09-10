import { prisma } from "@/lib/db/client";
import type { Donation, DonationType } from "@prisma/client";

export interface DonationFilters {
  startDate?: Date;
  endDate?: Date;
  type?: DonationType;
  minAmount?: number;
  maxAmount?: number;
}

export async function getDonations(filters: DonationFilters = {}) {
  const where: any = {};
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }
  if (filters.type) where.type = filters.type;
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    where.amount = {};
    if (filters.minAmount !== undefined) where.amount.gte = filters.minAmount;
    if (filters.maxAmount !== undefined) where.amount.lte = filters.maxAmount;
  }
  return prisma.donation.findMany({
    where,
    include: { donor: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDonation(data: {
  amount: number;
  currency?: string;
  type?: DonationType;
  note?: string;
  donorId?: string;
}) {
  return prisma.donation.create({ data });
}

export async function deleteDonation(id: string) {
  return prisma.donation.delete({ where: { id } });
}

export async function getDonationStats() {
  const total = await prisma.donation.aggregate({ _sum: { amount: true } });
  const count = await prisma.donation.count();
  return { total: total._sum.amount ?? 0, count };
}