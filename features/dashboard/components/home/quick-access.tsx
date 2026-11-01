import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  CalendarPlus,
  Flag,
  Key,
  LandPlot,
  LucideIcon,
  Pill,
  Stethoscope,
  Ticket,
  UserLock,
  Users2,
  Waypoints,
} from "lucide-react";
import { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/formatter";

type QuickAccessItem = {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  /** the primary call to action; styled as such in the `large` variant */
  primary?: boolean;
};

// Access is permission driven, not role driven: whoever holds the permission sees the shortcut.
const ITEMS: QuickAccessItem[] = [
  {
    key: "new-event",
    label: "New event",
    description: "Submit an event for approval",
    href: "/dashboard/events/add",
    icon: CalendarPlus,
    permission: "event:create",
    primary: true,
  },
  {
    key: "events",
    label: "Events",
    description: "Browse and track every event",
    href: "/dashboard/events",
    icon: Ticket,
    permission: "event:view",
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Approvals and updates for you",
    href: "/dashboard/notifications",
    icon: Bell,
    permission: "notification:view",
  },
  {
    key: "users",
    label: "Users",
    description: "Accounts and roles",
    href: "/dashboard/users",
    icon: Users2,
    permission: "user:view",
  },
  {
    key: "user-relations",
    label: "User relations",
    description: "Areas and products per user",
    href: "/dashboard/users/relation",
    icon: Waypoints,
    permission: "user_area:view",
  },
  {
    key: "doctors",
    label: "Doctors",
    description: "Consultant directory",
    href: "/dashboard/doctors",
    icon: Stethoscope,
    permission: "doctor:view",
  },
  {
    key: "products",
    label: "Products",
    description: "Product catalogue",
    href: "/dashboard/products",
    icon: Pill,
    permission: "product:view",
  },
  {
    key: "areas",
    label: "Areas",
    description: "Territory hierarchy",
    href: "/dashboard/area",
    icon: LandPlot,
    permission: "area:view",
  },
  {
    key: "event-types",
    label: "Event types",
    description: "Cost limits and approvers",
    href: "/dashboard/event-type",
    icon: UserLock,
    permission: "event_type:view",
  },
  {
    key: "roles",
    label: "Roles",
    description: "Role catalogue",
    href: "/dashboard/role",
    icon: Flag,
    permission: "role:view",
  },
  {
    key: "permissions",
    label: "Permissions",
    description: "What each role can do",
    href: "/dashboard/permissions",
    icon: Key,
    permission: "permission:view",
  },
];

export function QuickAccess({
  permissions,
  variant,
  counts = {},
}: {
  permissions: readonly Permission[];
  /** `compact` for dense admin tiles, `large` for the personal dashboard */
  variant: "compact" | "large";
  /** optional per-item totals shown in the compact tiles, keyed by item key */
  counts?: Partial<Record<string, number>>;
}) {
  const items = ITEMS.filter((item) => permissions.includes(item.permission));

  if (!items.length) return null;

  if (variant === "compact")
    return (
      <nav
        aria-label="Quick access"
        className="grid grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))] gap-3"
      >
        {items.map(({ key, label, href, icon: Icon }) => {
          const count = counts[key];

          return (
            <Link
              key={key}
              href={href}
              className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-blue-400">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{label}</span>
                {count !== undefined && (
                  <span className="block text-xs tabular-nums text-muted-foreground">
                    {formatNumber(count)}
                  </span>
                )}
              </span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </nav>
    );

  return (
    <nav
      aria-label="Quick access"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map(({ key, label, description, href, icon: Icon, primary }) => (
        <Link
          key={key}
          href={href}
          className={cn(
            "group flex min-h-28 flex-col justify-between gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
            primary
              ? "border-transparent bg-secondary text-secondary-foreground"
              : "bg-card hover:border-primary/40",
          )}
        >
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                primary ? "bg-white/20" : "bg-primary/10 text-primary dark:text-blue-400",
              )}
            >
              <Icon className="size-5" />
            </span>
            <ArrowUpRight
              className={cn(
                "size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                primary ? "opacity-80" : "text-muted-foreground",
              )}
            />
          </div>
          <div>
            <p className="font-medium">{label}</p>
            <p
              className={cn(
                "text-sm",
                primary ? "opacity-85" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          </div>
        </Link>
      ))}
    </nav>
  );
}
