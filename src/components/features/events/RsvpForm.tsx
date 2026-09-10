"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { rsvpToEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

interface RsvpFormProps {
  eventId: string;
}

export function RsvpForm({ eventId }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function formAction(state: { success?: boolean; message?: string } | null, formData: FormData) {
    return rsvpToEvent(state, formData);
  }

  const [state, dispatch, pending] = useActionState(formAction, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success && state.message) toast.error(state.message);
  }, [state]);

  if (state?.success) {
    return (
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>
      {state && !state.success && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Confirm RSVP
      </Button>
    </form>
  );
}