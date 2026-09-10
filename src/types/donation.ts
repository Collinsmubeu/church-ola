import type { Donation, DonationType } from "@prisma/client";

export interface DonationFormValues {
  amount: number;
  currency?: string;
  type?: DonationType;
  note?: string;
  donorId?: string;
}

export type DonationWithDonor = Donation & {
  donor: { name: string | null; email: string | null } | null;
};