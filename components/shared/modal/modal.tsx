"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogProps } from "@radix-ui/react-dialog";
import AlertModal from "../alert-dialog/alert-dialog";
import { toast } from "sonner";

const FormDialog = ({
  open,
  onOpenChange,
  className,
  children,
  formTitle,
  ...props
}: DialogProps & React.ComponentProps<"div"> & { formTitle: string }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>

        {/* form */}
        <div
          className={cn(
            "px-4 h-full max-h-[calc(100vh - 100px)] overflow-y-auto",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { FormDialog };
