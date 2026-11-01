"use client";

import { useId, useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

const MAX_VISIBLE = 2;

interface ComboboxMultipleSelectProps<T> {
  items: T[];
  value?: T[] | null;
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  getLabel?: (item: T) => string;
  getKey?: (item: T) => string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
}

const ComboboxMultipleSelect = <T,>({
  items,
  value,
  defaultValue,
  onValueChange,
  getLabel = (item: T) => String(item),
  getKey = (item: T) => String(item),
  placeholder = "Select",
  disabled,
  id: idProp,
  name,
  "aria-invalid": ariaInvalid,
}: ComboboxMultipleSelectProps<T>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const anchor = useComboboxAnchor();
  const [expanded, setExpanded] = useState(false);

  return (
    <Combobox
      multiple
      autoHighlight
      id={id}
      name={name}
      disabled={disabled}
      items={items}
      isItemEqualToValue={(a, b) => getKey(a) === getKey(b)}
      itemToStringLabel={getLabel}
      value={value ?? undefined}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      modal={false}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: T[]) => {
            const visibleValues = expanded
              ? values
              : values.slice(0, MAX_VISIBLE);
            const hiddenCount = values.length - MAX_VISIBLE;

            return (
              <>
                {visibleValues.map((item) => (
                  <ComboboxChip key={getKey(item)}>
                    {getLabel(item)}
                  </ComboboxChip>
                ))}
                {values.length > MAX_VISIBLE && (
                  <ComboboxChip
                    key="toggle"
                    showRemove={false}
                    className="cursor-pointer"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setExpanded((prev) => !prev);
                    }}
                  >
                    {expanded ? "Show Less" : `+${hiddenCount} more`}
                  </ComboboxChip>
                )}
                <ComboboxChipsInput
                  disabled={disabled}
                  aria-invalid={ariaInvalid}
                  placeholder={values.length ? undefined : placeholder}
                />
              </>
            );
          }}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={getKey(item)} value={item}>
              {getLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export { ComboboxMultipleSelect };
