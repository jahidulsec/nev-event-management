"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import React from "react";
import {
  getHonorariumCalculations,
  HonorariumCalculationMultiProps,
} from "../lib/honorarium";
import { FormDialog } from "@/components/shared/modal/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoData } from "@/components/shared/state/state";

export default function CheckTierModal() {
  const [open, setOpen] = React.useState(false);

  const [hList, setHList] = React.useState<HonorariumCalculationMultiProps[]>(
    [],
  );
  const [pending, startTransition] = React.useTransition();

  // get honorarium list
  React.useEffect(() => {
    const handleList = async () => {
      const res = await getHonorariumCalculations();

      if (res.success) {
        setHList(res.data ?? []);
      }
    };

    if (hList.length !== 0) return;
    startTransition(handleList);
  }, []);
  return (
    <>
      <Button
        size={"sm"}
        variant={"link"}
        className="text-xs border-b rounded-none border-dashed"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        Check Tier <Info />
      </Button>

      <FormDialog formTitle="Tier Details" open={open} onOpenChange={setOpen}>
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Designation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hList.length > 0 ? (
            hList.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.tier_name}</TableCell>
                <TableCell className="whitespace-wrap">
                  <TableCell>
                    {item.honorarium_designation.map((d, index) => (
                      <div key={index}>{d.designation}</div>
                    ))}
                  </TableCell>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={100}>
                <NoData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </FormDialog>
    </>
  );
}
