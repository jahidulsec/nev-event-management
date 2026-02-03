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
import { Loader2 } from "lucide-react";
import React from "react";
import { useDebounce } from "@/hooks/use-debounce";

type FetchParams = {
  page: number;
  size: number;
  search?: string;
};

type FetchResult<T> = {
  success: boolean;
  data?: T[];
};

interface AsyncComboboxProps<T> {
  fetcher: (params: FetchParams) => Promise<FetchResult<T>>;
  getLabel: (item: T) => string;
  getKey: (item: T) => React.Key;
  placeholder?: string;
  onValueChange?: (value: T | null) => void;
}

export function AsyncCombobox<T>({
  fetcher,
  getLabel,
  getKey,
  placeholder = "Select an option",
  onValueChange,
}: AsyncComboboxProps<T>) {
  const [data, setData] = React.useState<T[]>([]);
  const [input, setInput] = React.useState("");
  const search = useDebounce(input);

  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(async () => {
      const res = await fetcher({
        page: 1,
        size: 10,
        search,
      });

      if (res.success) {
        setData(res.data ?? []);
      }
    });
  }, [search, fetcher]);

  function getStatus() {
    if (pending) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="size-4 animate-spin" />
          Searching…
        </div>
      );
    }

    if (!search) {
      return "Start typing to search";
    }

    if (data.length === 0) {
      return `No matches for "${search}"`;
    }

    return null;
  }

  return (
    <Comboboxui
      filter={null}
      items={data}
      itemToStringLabel={getLabel}
      onValueChange={onValueChange}
      onInputValueChange={(value, { reason }) => {
        if (reason === "input-change" || reason === "input-clear") {
          setInput(value);
        }
      }}
    >
      <ComboboxInput placeholder={placeholder} />

      <ComboboxContent>
        <Combobox.Status className="px-2 py-2 text-sm text-muted-foreground">
          {getStatus()}
        </Combobox.Status>

        <ComboboxEmpty>No data found.</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={getKey(item)} value={item}>
              {getLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Comboboxui>
  );
}
