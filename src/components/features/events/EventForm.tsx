"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity?: number | null;
  };
}

type FormState = { success?: boolean; message?: string } | null;
type FormAction = (
  state: FormState,
  payload: FormData
) => Promise<{ success?: boolean; message?: string }>;

export function EventForm({ event }: EventFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formAction: FormAction = async (state, formData) => {
    setError(null);
    const result = event
      ? await updateEvent(state as any, formData)
      : await createEvent(state as any, formData);
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
      <DialogTrigger render={<Button />}>
        {event ? "Edit Event" : "Create Event"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            Fill in the details for the church event.
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          {event && <input type="hidden" name="id" value={event.id} />}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={event?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={event?.description}
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                defaultValue={event?.date}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" defaultValue={event?.time} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={event?.location}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (optional)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={event?.capacity ?? ""}
            />
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
              {event ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}