import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DialogProps } from "@radix-ui/react-dialog";

const FormSheet = ({
  open,
  onOpenChange,
  className,
  children,
  formTitle,
  ...props
}: DialogProps & React.ComponentProps<"div"> & { formTitle: string }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{formTitle}</SheetTitle>
        </SheetHeader>

        {/* form */}
        <div
          className={cn(
            "px-4 h-full max-h-[calc(100vh - 100px)] overflow-y-auto",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { FormSheet };
