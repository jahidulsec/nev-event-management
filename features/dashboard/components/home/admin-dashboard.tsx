import Link from "next/link";
import { format } from "date-fns";
import {
  BadgeCheck,
  CalendarPlus,
  Hourglass,
  ShieldCheck,
  Ticket,
  Wallet,
} from "lucide-react";
import { ErrorBoundary } from "@/components/shared/boundary/error-boundary";
import {
  SectionHeader,
  SectionActions,
} from "@/components/shared/section/section";
import {
  SectionHeading,
  SectionSubTitle,
} from "@/components/shared/typography/heading";
import { NoData } from "@/components/shared/state/state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActivePermissions } from "@/lib/permission-guard";
import { AuthUser } from "@/types/auth-user";
import { formatNumber } from "@/utils/formatter";
import { getAdminDashboard } from "../../libs/dashboard";
import { ActivityFeed } from "./activity-feed";
import {
  MonthlyColumnChart,
  RankedBars,
  Sparkline,
  StackedBar,
  StatusKey,
  StatusLegend,
} from "./charts";
import { UpcomingList } from "./event-list";
import { getChangePercent, getFirstName, getRoleLabel } from "./helpers";
import { QuickAccess } from "./quick-access";
import { StatCard } from "./stat-card";

export async function AdminDashboard({ user }: { user: AuthUser }) {
  const [res, permissions] = await Promise.all([
    getAdminDashboard(),
    getActivePermissions(),
  ]);

  const data = res.data;

  return (
    <ErrorBoundary message={!res.success ? res.message : undefined}>
      <SectionHeader>
        <div className="flex flex-col gap-1">
          <SectionHeading>
            Welcome back, {getFirstName(user.name)}
          </SectionHeading>
          <SectionSubTitle className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <ShieldCheck />
              Super admin
            </Badge>
            Organisation overview · {format(new Date(), "EEEE, LLL dd yyyy")}
          </SectionSubTitle>
        </div>
      </SectionHeader>

      <QuickAccess
        permissions={permissions}
        variant="compact"
        counts={
          data
            ? {
                users: data.directory.users,
                doctors: data.directory.doctors,
                products: data.directory.products,
                areas: data.directory.areas,
                "event-types": data.directory.eventTypes,
              }
            : undefined
        }
      />

      {!data ? (
        <NoData />
      ) : (
        <AdminAnalytics
          data={data}
          canViewEvents={permissions.includes("event:view")}
        />
      )}
    </ErrorBoundary>
  );
}

export function AdminAnalytics({
  data,
  canViewEvents,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>["data"]>;
  canViewEvents: boolean;
}) {
  const { totals, months, budget } = data;

  const thisMonth = months.at(-1);
  const lastMonth = months.at(-2);

  const decided = totals.approved + totals.rejected;
  const approvalRate = decided
    ? Math.round((totals.approved / decided) * 100)
    : null;

  return (
    <>
      {/* headline numbers */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          hero
          label="Total events"
          icon={Ticket}
          value={formatNumber(data.total)}
          change={{
            percent: getChangePercent(
              thisMonth?.total ?? 0,
              lastMonth?.total ?? 0,
            ),
            period: "vs last month",
          }}
          trend={
            <Sparkline
              values={months.map((month) => month.total)}
              label={`Events submitted per month: ${months
                .map((month) => `${month.label} ${month.total}`)
                .join(", ")}`}
            />
          }
        />
        <StatCard
          label="In review"
          icon={Hourglass}
          value={formatNumber(totals.processing)}
          hint={`${formatNumber(totals.rework)} sent back for rework`}
        />
        <StatCard
          label="Approval rate"
          icon={BadgeCheck}
          value={approvalRate === null ? "-" : `${approvalRate}%`}
          hint={`${formatNumber(totals.approved)} approved · ${formatNumber(totals.rejected)} rejected`}
        />
        <StatCard
          label="Budget requested this month"
          icon={Wallet}
          value={formatNumber(Math.round(budget.thisMonth))}
          change={{
            percent: getChangePercent(budget.thisMonth, budget.lastMonth),
            period: "vs last month",
          }}
          trend={
            <Sparkline
              values={budget.monthly}
              label={`Budget requested per month: ${months
                .map(
                  (month, i) =>
                    `${month.label} ${Math.round(budget.monthly[i])}`,
                )
                .join(", ")}`}
            />
          }
        />
      </div>

      {/* trend + status mix */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="gap-4 lg:col-span-2">
          <CardHeader>
            <CardTitle>Submissions per month</CardTitle>
            <CardDescription>
              Last {months.length} months, by current status
            </CardDescription>
            <CardAction className="hidden sm:block">
              <StatusKey />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StatusKey className="sm:hidden" />
            <MonthlyColumnChart months={months} />
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Status mix</CardTitle>
            <CardDescription>All active events</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <StackedBar counts={totals} />
            <StatusLegend counts={totals} className="grid-cols-1" />
          </CardContent>
        </Card>
      </div>

      {/* rankings */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Top event types</CardTitle>
            <CardDescription>By number of events</CardDescription>
          </CardHeader>
          <CardContent>
            <RankedBars rows={data.byType} caption="Events per event type" />
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Top products</CardTitle>
            <CardDescription>By number of events</CardDescription>
          </CardHeader>
          <CardContent>
            <RankedBars rows={data.byProduct} caption="Events per product" />
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Waiting on</CardTitle>
            <CardDescription>In-review events by next approver</CardDescription>
          </CardHeader>
          <CardContent>
            <RankedBars
              rows={data.waitingOn.map((row) => ({
                ...row,
                label: getRoleLabel(row.label),
              }))}
              caption="In-review events per next approver"
              emptyLabel="Nothing is waiting on an approver."
            />
          </CardContent>
        </Card>
      </div>

      {/* activity + upcoming */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="gap-4 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Submissions and approver decisions
            </CardDescription>
            {canViewEvents && (
              <CardAction>
                <Button variant="link" size="sm" asChild>
                  <Link href="/dashboard/events">See all</Link>
                </Button>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <ActivityFeed items={data.activity} />
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Upcoming events</CardTitle>
            <CardDescription>Next on the calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingList items={data.upcoming} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
