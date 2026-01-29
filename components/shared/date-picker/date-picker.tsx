"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DatePicker({
  onChange,
  className,
  defaultValue,
}: {
  className?: string;
  onChange?: (value: Date) => void;
  defaultValue?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-48 justify-between font-normal", className)}
          >
            {date ? format(date, "dd LLL, yyyy") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              if (date && onChange) {
                onChange(date);
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
