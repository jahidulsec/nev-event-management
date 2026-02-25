"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogProps } from "@radix-ui/react-dialog";

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
      <DialogContent className="sm:max-w-xl ">
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
