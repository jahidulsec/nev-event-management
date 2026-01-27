import { Construction, Folder } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function NoData() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>
        <EmptyTitle>No Data Yet</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

function CommingSoon() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Construction />
        </EmptyMedia>
        <EmptyTitle>Coming Soon</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription>
        This page is underconstruction. It will be released soon!
      </EmptyDescription>
    </Empty>
  );
}

export { NoData, CommingSoon };
