import { LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A single headline number. `hero` is the one number a view leads with (>= 48px);
 * everything else stays smaller. Values use proportional figures, not tabular.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hero = false,
  hint,
  change,
  trend,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hero?: boolean;
  hint?: string;
  /** percent vs. previous period; `null` when there is nothing to compare */
  change?: { percent: number | null; period: string };
  trend?: React.ReactNode;
  className?: string;
}) {
  const ChangeIcon =
    change?.percent == null || Math.abs(change.percent) < 0.5
      ? Minus
      : change.percent > 0
        ? TrendingUp
        : TrendingDown;

  return (
    <Card className={cn("gap-3 py-5", className)}>
      <div className="flex items-center justify-between gap-3 px-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-blue-400">
          <Icon className="size-4" />
        </span>
      </div>

      <div className="flex items-end justify-between gap-3 px-5">
        <div className="min-w-0">
          <p
            className={cn(
              "font-semibold leading-none",
              hero ? "text-5xl" : "text-3xl",
            )}
          >
            {value}
          </p>

          {/* delta color never says good/bad here: more events or budget is not inherently either */}
          {change ? (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <ChangeIcon className="size-3.5" />
              <span className="font-medium text-foreground">
                {change.percent == null
                  ? "New"
                  : `${change.percent > 0 ? "+" : ""}${Math.round(change.percent)}%`}
              </span>
              {change.period}
            </p>
          ) : hint ? (
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>

        {trend}
      </div>
    </Card>
  );
}
