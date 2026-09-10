"use client";

import { useState } from "react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteDonationAction } from "@/lib/actions/donations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface DonationWithDonor {
  id: string;
  amount: number;
  currency: string;
  type: string;
  note: string | null;
  createdAt: Date;
  donor: { name: string | null; email: string | null } | null;
}

export function DonationTable({ donations }: { donations: DonationWithDonor[] }) {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered =
    typeFilter === "all"
      ? donations
      : donations.filter((d) => d.type === typeFilter);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-4 text-muted-foreground" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="all">All Types</option>
          <option value="ONE_TIME">One Time</option>
          <option value="RECURRING">Recurring</option>
          <option value="OFFERING">Offering</option>
        </select>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(d.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{d.donor?.name || "Anonymous"}</TableCell>
                  <TableCell className="font-medium">
                    ${d.amount.toFixed(2)} {d.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.type.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {d.note || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteButton id={d.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No donations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [state, dispatch, pending] = useActionState(deleteDonationAction, null);

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