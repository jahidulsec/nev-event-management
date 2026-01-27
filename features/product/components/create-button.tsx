"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormSheet } from "@/components/shared/sheet/sheet";
import ProductForm from "./form";

export default function CreateProductButton() {
  const [open, setOpen] = React.useState(false);

  const title = `Product`;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> {title}
      </Button>

      <FormSheet open={open} onOpenChange={setOpen} formTitle={`Create ${title}`}>
        <ProductForm onClose={() => setOpen(false)} />
      </FormSheet>
    </>
  );
}
