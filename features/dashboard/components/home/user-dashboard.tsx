import Link from "next/link";
import { format } from "date-fns";
import { BellRing, CalendarPlus, ClipboardCheck, MapPin, Undo2 } from "lucide-react";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventQueryType } from "@/features/events/schemas/events";
import NotificationCard from "@/features/notifications/components/notification-card";
import {
  getNotifications,
  getNotificationStats,
  NotificationMultiProps,
} from "@/features/notifications/libs/notifications";
import { getActivePermissions } from "@/lib/permission-guard";
import { Permission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/types/auth-user";
import { formatNumber } from "@/utils/formatter";
import { getUserDashboard, UserDashboardData } from "../../libs/dashboard";
import { STATUS_META, STATUS_ORDER, StackedBar } from "./charts";
import { ActionList, EmptyList, UpcomingList } from "./event-list";
import { getFirstName, getRoleLabel } from "./helpers";
import { QuickAccess } from "./quick-access";

export async function UserDashboard({
  user,
  role,
  sapAreaCode,
}: {
  user: AuthUser;
  role?: string | null;
  sapAreaCode?: string | null;
}) {
  const permissions = await getActivePermissions();
  const canViewNotifications = permissions.includes("notification:view");

  const [res, notificationsRes, statsRes] = await Promise.all([
    getUserDashboard({
      role: (role ?? undefined) as EventQueryType["role"],
      employeeId: user.employeeId,
      sapAreaCode: sapAreaCode ?? undefined,
    }),
    canViewNotifications
      ? getNotifications({ page: 1, size: 5, employee_id: user.employeeId })
      : undefined,
    canViewNotifications
      ? getNotificationStats({ employee_id: user.employeeId })
      : undefined,
  ]);

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <UserDashboardView
        user={user}
        role={role}
        sapAreaCode={sapAreaCode}
        permissions={permissions}
        data={res.data}
        notifications={notificationsRes?.data ?? []}
        actionCount={statsRes?.data?.action ?? 0}
      />
    </ErrorBoundary>
  );
}

/** Presentational half: takes already-fetched data so it can be rendered from fixtures. */
export function UserDashboardView({
  user,
  role,
  sapAreaCode,
  permissions,
  data,
  notifications,
  actionCount,
}: {
  user: Pick<AuthUser, "name">;
  role?: string | null;
  sapAreaCode?: string | null;
  permissions: readonly Permission[];
  data: UserDashboardData | null;
  notifications: NotificationMultiProps[];
  actionCount: number;
}) {
  const canViewNotifications = permissions.includes("notification:view");

  return (
    <>
      {/* welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/70 p-6 text-primary-foreground sm:p-8">
        <div
          aria-hidden
          className="absolute -right-16 -top-20 size-64 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 right-32 size-56 rounded-full bg-white/5"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm opacity-80">{format(new Date(), "EEEE, LLL dd yyyy")}</p>
            <h1 className="font-heading text-3xl font-bold">
              Welcome back, {getFirstName(user.name)}
            </h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-90">
              {role && <span>{getRoleLabel(role)}</span>}
              {sapAreaCode && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  Area {sapAreaCode}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {actionCount > 0 && (
              <Button
                asChild
                variant="ghost"
                className="bg-white/15 text-primary-foreground hover:bg-white/25 hover:text-primary-foreground"
              >
                <Link href="/dashboard/notifications">
                  <BellRing />
                  {actionCount} need{actionCount === 1 ? "s" : ""} your action
                </Link>
              </Button>
            )}
            {permissions.includes("event:create") && (
              <Button asChild variant="secondary">
                <Link href="/dashboard/events/add">
                  <CalendarPlus />
                  New event
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {data?.canViewEvents && (
        <>
          {/* what needs doing */}
          <section aria-labelledby="attention-heading" className="flex flex-col gap-3">
            <h2 id="attention-heading" className="font-heading text-lg font-semibold">
              Needs your attention
            </h2>

            <div
              className={cn(
                "grid gap-4",
                data.canApprove && "lg:grid-cols-2",
              )}
            >
              {data.canApprove && (
                <AttentionCard
                  icon={<ClipboardCheck className="size-5" />}
                  title="Awaiting your approval"
                  description="Oldest first"
                  count={data.awaiting.count}
                  tone="bg-orange-400/10 text-orange-600"
                >
                  {data.awaiting.items.length ? (
                    <ActionList
                      waitingSince
                      items={data.awaiting.items}
                      count={data.awaiting.count}
                    />
                  ) : (
                    <EmptyList>Nothing is waiting for your approval.</EmptyList>
                  )}
                </AttentionCard>
              )}

              <AttentionCard
                icon={<Undo2 className="size-5" />}
                title="Sent back to you"
                description="Events you submitted that need rework"
                count={data.rework.count}
                tone="bg-blue-500/10 text-blue-600"
              >
                {data.rework.items.length ? (
                  <ActionList items={data.rework.items} count={data.rework.count} />
                ) : (
                  <EmptyList>No events were sent back to you.</EmptyList>
                )}
              </AttentionCard>
            </div>
          </section>

          {/* status at a glance */}
          <Card className="gap-5">
            <CardHeader>
              <CardTitle>Events in your scope</CardTitle>
              <CardDescription>
                {formatNumber(data.total)} in total across your area and products
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <StackedBar counts={data.stats} />

              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {STATUS_ORDER.map((status) => {
                  const { label, icon: Icon, swatch } = STATUS_META[status];

                  return (
                    <li key={status} className="rounded-xl bg-muted/50 p-4">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={cn("size-2.5 rounded-full", swatch)} />
                        <Icon className="size-3.5" />
                        {label}
                      </p>
                      <p className="mt-2 font-heading text-3xl font-semibold leading-none">
                        {formatNumber(data.stats[status])}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* shortcuts */}
      <section aria-labelledby="shortcuts-heading" className="flex flex-col gap-3">
        <h2 id="shortcuts-heading" className="font-heading text-lg font-semibold">
          Quick access
        </h2>
        <QuickAccess permissions={permissions} variant="large" />
      </section>

      {/* recent activity + upcoming */}
      <div
        className={cn(
          "grid gap-4",
          canViewNotifications && data?.canViewEvents && "lg:grid-cols-5",
        )}
      >
        {canViewNotifications && (
          <Card className="gap-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent activities</CardTitle>
              <CardDescription>Your latest notifications</CardDescription>
              <CardAction>
                <Button variant="link" size="sm" asChild>
                  <Link href="/dashboard/notifications">See all</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {notifications.length ? (
                <div className="flex flex-col gap-3">
                  {notifications.map((item) => (
                    <NotificationCard key={item.id} data={item} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {data?.canViewEvents && (
          <Card className="gap-4 lg:col-span-2">
            <CardHeader>
              <CardTitle>Coming up</CardTitle>
              <CardDescription>Next events in your scope</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingList items={data.upcoming} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function AttentionCard({
  icon,
  title,
  description,
  count,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className={cn("flex size-10 items-center justify-center rounded-xl", tone)}>
            {icon}
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <CardAction>
          <span className="font-heading text-2xl font-semibold">{formatNumber(count)}</span>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
