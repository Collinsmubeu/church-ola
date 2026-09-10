"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FormProps {
  action: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function ServerForm({ action, children, onSuccess, onError }: FormProps) {
  async function formAction(formData: FormData) {
    const result = await action(formData);
    if (result?.success) {
      onSuccess?.();
    } else if (result?.message) {
      onError?.(result.message);
    }
  }

  return (
    <form action={formAction}>
      {children}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4">
      {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
      Submit
    </Button>
  );
}