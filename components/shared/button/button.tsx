"use client";

import { ArrowLeft, Columns2, Loader, Rows3 } from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import { Button, ButtonProps } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cva, VariantProps } from "class-variance-authority";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className="rounded-full text-primary"
      onClick={() => router.back()}
    >
      <ArrowLeft /> <span className="sr-only">Back to previous page</span>
    </Button>
  );
};

const ActionButton = ({
  children,
  isPending = false,
  ...props
}: ButtonProps & { isPending?: boolean }) => {
  return (
    <Button {...props} disabled={isPending || props.disabled}>
      {isPending ? <Loader className="animate-spin" /> : children}
    </Button>
  );
};

const FormButton = ({
  children,
  isPending,
  className,
  ...props
}: ButtonProps & { isPending?: boolean }) => {
  return (
    <Button
      className={cn("font-semibold", className)}
      {...props}
      disabled={isPending || props.disabled}
    >
      {isPending && <Loader className="animate-spin" />}
      {children}
    </Button>
  );
};

const ViewButtonGroup = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const layoutList = [
    {
      icon: Columns2,
      label: "Folder View",
      param: "folder",
    },
    {
      icon: Rows3,
      label: "Tabular View",
      param: "tabular",
    },
  ];

  const validatedView =
    searchParams.get("view") === "tabular" ? "tabular" : "folder";

  return (
    <ButtonGroup
      aria-label="Button group"
      className="w-full sm:w-fit justify-end"
    >
      {layoutList.map((item) => (
        <Button
          key={item.label}
          variant={validatedView === item.param ? "default" : "outline"}
          data-active={validatedView}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("view", item.param);
            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          <item.icon />
          <span className="sr-only">{item.label}</span>
        </Button>
      ))}
    </ButtonGroup>
  );
};

const tableButtonVariants = cva("rounded-full", {
  variants: {
    variant: {
      default: "",
      edit: "text-primary",
      delete: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TableActionButton = ({
  tooltip,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof tableButtonVariants> & { tooltip: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(tableButtonVariants({ variant, className }))}
          size={"icon"}
          variant={"outline"}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export {
  BackButton,
  ActionButton,
  FormButton,
  ViewButtonGroup,
  TableActionButton,
};
