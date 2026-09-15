"use client";

import { FormSheet } from "@/components/shared/sheet/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import RoleForm from "./role-form";
import { toast } from "sonner";

export default function CreateRoleButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> Role
      </Button>

      <FormSheet formTitle="Create Role" open={open} onOpenChange={setOpen}>
        <RoleForm
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
