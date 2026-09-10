"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createDonation } from "@/lib/actions/donations";
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

type FormState = { success?: boolean; message?: string } | null;
type FormAction = (
  state: FormState,
  payload: FormData
) => Promise<{ success?: boolean; message?: string }>;

export function DonationForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formAction: FormAction = async (state, formData) => {
    setError(null);
    const result = await createDonation(state as any, formData);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.message || "Something went wrong");
    }
    return { success: result.success, message: result.message };
  };

  const [state, dispatch, pending] = useActionState(formAction, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success && state.message) toast.error(state.message);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Record Donation</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Donation</DialogTitle>
          <DialogDescription>Enter the details of a new donation.</DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" defaultValue="USD" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="ONE_TIME"
            >
              <option value="ONE_TIME">One Time</option>
              <option value="RECURRING">Recurring</option>
              <option value="OFFERING">Offering</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="donorId">Donor ID (optional)</Label>
            <Input id="donorId" name="donorId" placeholder="User ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" name="note" placeholder="Optional note" />
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
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}