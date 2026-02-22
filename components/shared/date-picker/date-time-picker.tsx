"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

export function DatePickerTime({
  onValueChange,
  defaultValue,
}: {
  onValueChange?: (value: Date) => void;
  defaultValue?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  const [time, setTime] = React.useState(
    defaultValue ? format(defaultValue, "hh:mm:ss") : "10:30:00",
  );

  // Combine date + time
  const combinedDateTime = React.useMemo(() => {
    if (!date) return null;

    const [hours, minutes, seconds] = time.split(":").map(Number);

    const newDate = new Date(date);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    newDate.setSeconds(seconds || 0);

    return newDate;
  }, [date, time]);

  React.useEffect(() => {
    if (onValueChange && combinedDateTime) {
      onValueChange(combinedDateTime);
    }
  }, [combinedDateTime]);

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row gap-2">
      <Field>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-32 justify-between font-normal"
            >
              {date ? format(date, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(selected) => {
                setDate(selected);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field className="w-40">
        <Input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
