"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import EventTypeApproverForm from "./form";

export default function CreatEventTypeApproverButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Approver`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <EventTypeApproverForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
