"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export interface FormState {
  success?: boolean;
  message?: string;
}

type FormAction = (state: FormState | null, payload: FormData) => Promise<FormState>;

interface DeleteButtonProps {
  action: FormAction;
  id: string;
}

export function DeleteButton({ action, id }: DeleteButtonProps) {
  const [state, dispatch, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state && !state.success && state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
      </Button>
    </form>
  );
}