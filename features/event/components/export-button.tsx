"use client";

import { Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { convertToCSV } from "@/utils/csv";
import { ActionButton } from "@/components/shared/button/button";
import { getEventsExportInformation } from "../lib/event";

export default function ExportButton() {
  const [isPending, startTransition] = React.useTransition();
  const params = useSearchParams();

  const downloadCSV = async (name: string) => {
    const res = await getEventsExportInformation();

    if (res.success === false) {
      toast.error(res?.message);
      return;
    }

    if (res?.data?.length == 0) {
      toast.warning("No data found");
      return;
    }

    const header = [
      {
        header: "ranking",
        name: "Rank",
      },
      {
        header: "zone_name",
        name: "Zone Name",
      },
      {
        header: "region_name",
        name: "Region Name",
      },
      {
        header: "area_name",
        name: "Area Name",
      },
      {
        header: "sap_id",
        name: "SAP MIO Code",
      },
      {
        header: "full_name",
        name: "MIO Name",
      },
      {
        header: "mobile",
        name: "MIO Mobile",
      },
      {
        header: "team",
        name: "Team",
      },
      {
        header: "total_mark",
        name: "Marks",
      },
      {
        header: "total_duration_s",
        name: "Duration (minutes)",
      },
    ];

    const csvData = new Blob(
      [
        convertToCSV(
          res?.data ?? [],
          header,
          [],
          [
            {
              headerName: "total_duration_s",
              format: (value) => {
                return (Number(value) / 60).toFixed(2);
              },
            },
          ],
        ),
      ],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
      },
    );
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ActionButton
        isPending={isPending}
        onClick={() =>
          startTransition(
            async () =>
              await downloadCSV(
                "quiz_leaderboard__" +
                  (params.get("team") || "") +
                  "_" +
                  (params.get("month") || "") +
                  "_" +
                  (params.get("quiz_id") || ""),
              ),
          )
        }
      >
        <Download /> Export
      </ActionButton>
    </>
  );
}
