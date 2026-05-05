"use client"

import { approver, approver_type } from "@/lib/generated/prisma";
import { ApproverTypeBadge } from "../badge/badge";
import { NoData } from "../state/state";
import React from "react";
import { getApproverList } from "@/features/approver/libs/approver";
import { SectionLoader } from "../skeleton/section";

export const getApproverListRankValue = (value: approver_type) => {
  let rank;

  switch (value) {
    case "budget":
      rank = 5;
      break;

    case "final":
      rank = 4;
      break;

    case "third":
      rank = 3;
      break;

    case "second":
      rank = 2;
      break;

    default:
      rank = 1;
      break;
  }

  return rank;
};

export function ApproverFlowChart({ eventTypeId }: { eventTypeId: string }) {
  const [pending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<approver[]>([])

  React.useEffect(() => {
    if (!eventTypeId) return;

    const handleData = async () => {
      const res = await getApproverList(eventTypeId);

      if (res.success) {
        setData(res.data ?? [])
      }
    }

    startTransition(() => {
      handleData()
    })
  }, [eventTypeId])

  return (
    <div className="flex flex-col justify-center gap-6 min-h-50">
      {pending ? <SectionLoader /> :
        data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              className="relative border border-primary/25 flex justify-center items-center gap-6 p-4 rounded-md"
              key={item.id}
            >
              <div className="flex items-center gap-3">
                {item.user_type.toUpperCase()}
                <ApproverTypeBadge type={item.type}>
                  <p>{item.type}</p>
                </ApproverTypeBadge>
              </div>
              {index !== 0 && (
                <div className="absolute -top-6 h-6 w-px bg-primary/25"></div>
              )}
            </div>
          ))
        ) : (
          <NoData />
        )}
    </div>
  );
}
