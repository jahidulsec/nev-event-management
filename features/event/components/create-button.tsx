import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CreateEventButton() {
  return (
    <Button asChild>
      <Link href={`/dashboard/events/add`}>
        <PlusCircle /> Event
      </Link>
    </Button>
  );
}
