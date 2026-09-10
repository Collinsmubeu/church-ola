import type { VolunteerRole } from "@prisma/client";
import type { User } from "@prisma/client";

export interface VolunteerRoleWithUser extends VolunteerRole {
  user: User;
}

export interface UserOption {
  id: string;
  name: string | null;
  email: string | null;
}