"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import ProductUserForm from "./form";

export default function CreateProductUserButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Product User`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <ProductUserForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
