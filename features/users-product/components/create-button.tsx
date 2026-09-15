"use client";

import { FormSheet } from "@/components/shared/sheet/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import UserProductForm from "./form";

export default function CreateUserProductButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> Product Scope
      </Button>

      <FormSheet
        formTitle="Create Product Scope"
        open={open}
        onOpenChange={setOpen}
      >
        <UserProductForm
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
