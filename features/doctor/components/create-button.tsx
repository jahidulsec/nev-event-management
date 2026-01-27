"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import QuizForm from "./quiz-form";
import { FormSheet } from "@/components/shared/sheet/sheet";
import DoctorForm from "./form";

export default function CreateDoctorButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Doctor`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <DoctorForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
