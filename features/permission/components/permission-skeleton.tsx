import { Skeleton } from "@/components/ui/skeleton";

export default function PermissionSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-26 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-112 rounded-3xl" />
    </div>
  );
}
