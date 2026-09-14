"use client";

import { FormSheet } from "@/components/shared/sheet/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import UserForm from "./user-form";
import { toast } from "sonner";

export default function CreateUserButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> user
      </Button>

      <FormSheet formTitle="Create User" open={open} onOpenChange={setOpen}>
        <UserForm
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
