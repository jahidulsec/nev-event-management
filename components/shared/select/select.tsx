"use client";

import React from "react";
import {
  Select as SelectUi,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";

const Select = ({
  data,
  className,
  placeholder,
  id,
  paramsName,
  pending,
  onValueChange,
  ...props
}: React.ComponentProps<React.FC<SelectProps>> & {
  className?: string;
  placeholder?: string;
  id?: string;
  data: { label: string; value: string }[];
  paramsName?: string;
  pending?: boolean;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SelectUi
      {...props}
      onValueChange={(value) => {
        if (value && paramsName) {
          const params = new URLSearchParams(searchParams);
          params.set(paramsName, value);
          router.push(`${pathname}?${params.toString()}`);
        }

        onValueChange?.(value);
      }}
      defaultValue={
        props.defaultValue ??
        (paramsName ? (searchParams.get(paramsName) ?? undefined) : undefined)
      }
    >
      <SelectTrigger
        className={cn("[&_svg]:text-primary bg-background", className)}
      >
        <SelectValue id={id} placeholder={placeholder ?? "Select"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.length > 0 ? (
            data.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          ) : (
            <SelectLabel className="text-xs text-muted-foreground">
              {pending ? "Loading..." : "No data."}
            </SelectLabel>
          )}
        </SelectGroup>
      </SelectContent>
    </SelectUi>
  );
};

export { Select };
