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
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type SelectOption = { label: string; value: string; disabled?: boolean };

type SelectProps = React.ComponentProps<typeof SelectUi> & {
  className?: string;
  placeholder?: string;
  id?: string;
  data: SelectOption[];
  /** when set, the selected value is synced to this search param */
  paramsName?: string;
  pending?: boolean;
};

const Select = ({
  data,
  className,
  placeholder = "Select",
  id,
  paramsName,
  pending,
  onValueChange,
  defaultValue,
  ...props
}: SelectProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const paramValue = paramsName ? searchParams.get(paramsName) : null;

  const setParam = (value: string | null) => {
    if (!paramsName) return;

    const params = new URLSearchParams(searchParams);
    if (value) params.set(paramsName, value);
    else params.delete(paramsName);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleValueChange = (value: string) => {
    if (value) setParam(value);
    onValueChange?.(value);
  };

  return (
    <SelectUi
      {...props}
      // remount when the search param changes so the uncontrolled value resets on clear
      key={paramsName ? (paramValue ?? "") : undefined}
      onValueChange={handleValueChange}
      defaultValue={defaultValue ?? paramValue ?? undefined}
    >
      <SelectTrigger
        className={cn("[&_svg]:text-primary bg-background", className)}
      >
        <SelectValue id={id} placeholder={placeholder} />
      </SelectTrigger>

      {/* clear button for searchparams select */}
      {paramValue !== null && (
        <Button
          variant="outline"
          size="icon"
          className="-ml-1.5"
          title="Clear"
          onClick={() => setParam(null)}
        >
          <X />
          <span className="sr-only">Clear</span>
        </Button>
      )}

      <SelectContent>
        <SelectGroup>
          {data.length > 0 ? (
            data.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
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
export type { SelectOption, SelectProps };
