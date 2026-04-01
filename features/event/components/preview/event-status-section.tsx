import { SectionContent } from "@/components/shared/section/section";
import { SectionHeading2 } from "@/components/shared/typography/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { event_current_status } from "@/lib/generated/prisma";
import Link from "next/link";

export function EventStatusSection({
  status,
}: {
  status: event_current_status;
}) {
  return (
    <SectionContent className="border p-6 rounded-md">
      <div className="max-w-4xl mx-auto py-10 w-full flex flex-col gap-6">
        <SectionHeading2>Event Current Status</SectionHeading2>
        <Separator />

        <div className="flex justify-center items-center flex-col gap-3">
          <p className="text-center text-balance">
            This event is <strong>{status}</strong>. No further action is
            required.
          </p>
          <Button asChild>
            <Link href={`/dashboard`}>Go back</Link>
          </Button>
        </div>
      </div>
    </SectionContent>
  );
}
