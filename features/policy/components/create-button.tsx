"use client";

import { FormSheet } from "@/components/shared/sheet/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import PolicyForm from "./form";

export default function CreatePolicyButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> Policy
      </Button>

      <FormSheet formTitle="Create Policy" open={open} onOpenChange={setOpen}>
        <PolicyForm
          onSuccess={(message) => {
            toast.success(message);
            setOpen(false);
          }}
          onError={(message) => toast.error(message)}
        />
      </FormSheet>
    </>
  );
}
