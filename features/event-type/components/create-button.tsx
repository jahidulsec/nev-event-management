"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import EventTypeForm from "./form";

export default function CreatEventTypeButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Type`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <EventTypeForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
