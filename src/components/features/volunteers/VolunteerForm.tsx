"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createVolunteerRole, updateVolunteerRole } from "@/lib/actions/volunteers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface VolunteerFormProps {
  role?: {
    id: string;
    team: string;
    role: string;
    userId: string;
    active: boolean;
  };
  users?: { id: string; name: string | null; email: string | null }[];
}

export function VolunteerForm({ role, users = [] }: VolunteerFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function formAction(state: { success?: boolean; message?: string } | null, formData: FormData) {
    setError(null);
    const result = role
      ? await updateVolunteerRole(state, formData)
      : await createVolunteerRole(state, formData);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.message || "Something went wrong");
    }
    return result;
  }

  const [state, dispatch, pending] = useActionState(formAction, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success && state.message) toast.error(state.message);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        {role ? "Edit Role" : "Assign Role"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Assign Volunteer Role"}</DialogTitle>
          <DialogDescription>Assign a member to a volunteer team.</DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          {role && <input type="hidden" name="id" value={role.id} />}
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input id="team" name="team" defaultValue={role?.team} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" defaultValue={role?.role} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">Member</Label>
            <select
              id="userId"
              name="userId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={role?.userId}
              required
            >
              <option value="">Select a member</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked={role?.active ?? true}
              className="size-4 rounded border-input"
            />
            <Label htmlFor="active">Active</Label>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {role ? "Update" : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}