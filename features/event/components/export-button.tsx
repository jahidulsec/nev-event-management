"use client";

import { Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { convertToCSV } from "@/utils/csv";
import { ActionButton } from "@/components/shared/button/button";
import { getEventsExportInformation } from "../lib/event";
import { getTitleCase, numberToWords } from "@/utils/formatter";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function ExportButton() {
  const [isPending, startTransition] = React.useTransition();
  const searchParams = useSearchParams()

  const downloadCSV = async (name: string) => {
    const res = await getEventsExportInformation({
      start: searchParams.get('start') ?? undefined,
      end: searchParams.get('end') ?? undefined,
      status: searchParams.get('status') as 'approved' ?? undefined,
    });

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
        header: "track_no",
        name: "Tracking No.",
      },
      {
        header: "work_area",
        name: "Work Area",
      },
      {
        header: "employee_id",
        name: "Employee ID",
      },
      {
        header: "full_name",
        name: "Activity Owner",
      },
      {
        header: "group_name",
        name: "Franchise",
      },
      {
        header: "title",
        name: "Event Type",
      },
      {
        header: "product",
        name: "Product",
      },
      {
        header: "event_title",
        name: "Event Title & Topic",
      },
      {
        header: "rm_name",
        name: "RM Name",
      },
      {
        header: "rm_code",
        name: "Region",
      },
      {
        header: "created_at",
        name: "Request Date",
      },
      {
        header: "event_date",
        name: "Proposed Event Date",
      },
      {
        header: "venue",
        name: "Venue Name with Address",
      },
      {
        header: "institute",
        name: "Institute Name, Customer Code of the Institute & Address",
      },
      {
        header: "institute_dept",
        name: "Department/Specialty",
      },
      {
        header: "food_supplier",
        name: "Food Supplier",
      },
      {
        header: "total_participants",
        name: "Total Participants",
      },

      {
        header: "venue_charge",
        name: "Venue Charge",
      },
      {
        header: "food_cost",
        name: "Food",
      },
      {
        header: "transportation",
        name: "Transportation",
      },
      {
        header: "projector",
        name: "Projector-Screen",
      },
      {
        header: "sound_system",
        name: "Sound System",
      },
      {
        header: "other_cost",
        name: "Logistics/Others",
      },
      {
        header: "total_budget",
        name: "Total Event Budget(Food & Logistics)",
      },
      {
        header: "total_eb_h",
        name: "Total Budget(EB+Honor)",
      },
      {
        header: "dr_child_id",
        name: "Consultant ID",
      },
      {
        header: "dr_name",
        name: "Name",
      },
      {
        header: "honorarium",
        name: "Honorarium",
      },
      {
        header: "h_words",
        name: "Honorarium (In Word)",
      },
      {
        header: "nth_engagement",
        name: "Nth Engagement",
      },
      {
        header: "current_status",
        name: "Event Approval Status",
      },
    ];

    let prevId = '';

    const formattedData = res?.data?.map((item) => {
      item.h_words = numberToWords(item.honorarium);
      if (prevId === item.id) {
        return {
          track_no: item.track_no,
          current_status: item.current_status,
          dr_child_id: item.dr_child_id,
          dr_name: item.dr_name,
          honorarium: item.honorarium,
          h_words: item.h_words,
          nth_engagement: item.nth_engagement,
        };
      }

      prevId = item.id;
      return item;
    }) ?? [];

    const csvData = new Blob(
      [
        convertToCSV(
          formattedData,
          header,
          [],
          [
            {
              headerName: "created_at",
              format: (value) => {
                return value ? format(new Date(value as any), 'dd/MM/yy - h:mm aaa') : '-';
              },
            },
            {
              headerName: "event_date",
              format: (value) => {
                return value ? format(new Date(value as any), 'dd/MM/yy - h:mm aaa') : '-';
              },
            },
            {
              headerName: "current_status",
              format: (value) => {
                return getTitleCase(value as string);
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
                "event_proposals_till_" + format(new Date(), 'dd-MM-yyyy')
              ),
          )
        }
      >
        <Download /> Export
      </ActionButton>
    </>
  );
}
