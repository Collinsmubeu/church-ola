"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toggleVolunteerActive, deleteVolunteerRoleAction as deleteVolunteerRole } from "@/lib/actions/volunteers";
import { DeleteButton } from "@/components/ui/delete-button";
import { VolunteerForm } from "@/components/features/volunteers/VolunteerForm";

interface VolunteerRoleWithUser {
  id: string;
  team: string;
  role: string;
  active: boolean;
  createdAt: Date;
  user: { id: string; name: string | null; email: string | null };
}

interface UserOption {
  id: string;
  name: string | null;
  email: string | null;
}

interface TeamCardProps {
  team: string;
  roles: VolunteerRoleWithUser[];
  users?: UserOption[];
}

export function TeamCard({ team, roles, users = [] }: TeamCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{team}</CardTitle>
        <Badge variant="secondary">{roles.length} roles</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-md border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <User className="size-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.user?.name || r.user?.email}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <VolunteerForm
                role={{ id: r.id, team: r.team, role: r.role, userId: r.user.id, active: r.active }}
                users={users}
              />
              <ToggleActiveButton id={r.id} active={r.active} />
              <DeleteButton action={deleteVolunteerRole} id={r.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const [state, dispatch, pending] = useActionState(toggleVolunteerActive, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={(!active).toString()} />
      <Button type="submit" variant="ghost" size="icon-sm" disabled={pending}>
        {active ? (
          <CheckCircle2 className="size-4 text-green-500" />
        ) : (
          <XCircle className="size-4 text-muted-foreground" />
        )}
      </Button>
    </form>
  );
}