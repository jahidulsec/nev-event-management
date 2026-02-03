"use client";

import {
  Combobox as Comboboxui,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Combobox } from "@base-ui/react";
import { getDoctors } from "@/features/doctor/lib/doctor";
import { doctor } from "@/lib/generated/prisma";
import { Loader2 } from "lucide-react";
import React from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function ComboboxDoctor({
  onValueChange,
}: {
  onValueChange?: (value: any) => void;
}) {
  const [data, setData] = React.useState<doctor[]>([]);
  const [input, setInput] = React.useState<string>("");
  const search = useDebounce(input);

  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    const handleDoctor = async () => {
      const res = await getDoctors({
        page: 1,
        size: 10,
        search: search,
      });

      if (res.success) {
        setData(res.data ?? []);
      }
    };

    startTransition(async () => {
      await handleDoctor();
    });
  }, [search]);

  function getStatus() {
    if (pending) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="animate-spin size-4" aria-hidden />
          Searching…
        </div>
      );
    }

    if (search === "") {
      return search ? null : "Start typing to search";
    }

    if (search?.length === 0) {
      return `No matches for "${search}".`;
    }

    return null;
  }

  return (
    <>
      <Comboboxui
        filter={null}
        onInputValueChange={(nextSearchValue, { reason }) => {
          console.log(nextSearchValue);
          console.log(reason);
          if (reason === "input-change" || reason === "input-clear")
            setInput(nextSearchValue);
        }}
        items={data}
        itemToStringLabel={(user: doctor) => user.full_name}
        onValueChange={onValueChange}
      >
        <ComboboxInput placeholder="Select a doctor" />
        <ComboboxContent>
          <Combobox.Status
            className={"px-2 text-muted-foreground text-sm py-2"}
          >
            {getStatus()}
          </Combobox.Status>
          <ComboboxEmpty>No data found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <>
                <ComboboxItem
                  onSelect={(value) => console.log(value)}
                  key={item.id}
                  value={item}
                >
                  {item.full_name}
                </ComboboxItem>
              </>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Comboboxui>
    </>
  );
}
