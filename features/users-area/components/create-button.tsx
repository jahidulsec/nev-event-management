"use client";

import { FormSheet } from "@/components/shared/sheet/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import UserAreaForm from "./form";

export default function CreateUserAreaButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> Area Scope
      </Button>

      <FormSheet formTitle="Create Area Scope" open={open} onOpenChange={setOpen}>
        <UserAreaForm
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
