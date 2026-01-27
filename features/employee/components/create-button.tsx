"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import EmployeeForm from "./form";

export default function CreateEmployeeButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Employee`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <EmployeeForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
