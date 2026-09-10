"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createSermon, updateSermon } from "@/lib/actions/sermons";
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

interface SermonFormProps {
  sermon?: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    audioUrl: string;
    speaker: string;
    date: string;
    duration?: number;
  };
}

type FormState = { success?: boolean; message?: string } | null;
type FormAction = (
  state: FormState,
  payload: FormData
) => Promise<{ success?: boolean; message?: string }>;

export function SermonForm({ sermon }: SermonFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formAction: FormAction = async (state, formData) => {
    setError(null);
    const result = sermon
      ? await updateSermon(state as any, formData)
      : await createSermon(state as any, formData);
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
        {sermon ? "Edit Sermon" : "Add Sermon"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sermon ? "Edit Sermon" : "Add Sermon"}</DialogTitle>
          <DialogDescription>
            Add video URL, speaker, date, and description.
          </DialogDescription>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          {sermon && <input type="hidden" name="id" value={sermon.id} />}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={sermon?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
            <Input id="speaker" name="speaker" defaultValue={sermon?.speaker} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              defaultValue={sermon?.date}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={sermon?.videoUrl}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio URL (optional)</Label>
            <Input
              id="audioUrl"
              name="audioUrl"
              type="url"
              defaultValue={sermon?.audioUrl}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration in seconds (optional)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              defaultValue={sermon?.duration ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={sermon?.description}
              rows={3}
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
              {sermon ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}