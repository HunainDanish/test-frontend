import {
  Users,
  Activity,
  Zap,
  Clock,
  List,
  Camera,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: number;
  icon: "users" | "activity" | "zap" | "clock" | "list" | "camera";
  isLoading?: boolean;
}

const iconMap = {
  users: Users,
  activity: Activity,
  zap: Zap,
  clock: Clock,
  list: List,
  camera: Camera,
};

export function KPICard({
  label,
  value,
  unit,
  subtext,
  trend,
  icon,
  isLoading,
}: KPICardProps) {
  const IconComponent = iconMap[icon];
  const isTrendPositive = trend ? trend > 0 : false;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-10 w-32 animate-pulse rounded bg-muted" />
            {subtext && (
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            )}
            {trend !== undefined && !subtext && (
              <div className="mt-2 h-4 w-16 animate-pulse rounded bg-muted" />
            )}
          </div>
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {subtext && (
            <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
          )}
          {trend !== undefined && !subtext && (
            <div className="mt-2 flex items-center gap-1">
              {isTrendPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  isTrendPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(trend)}% vs last period
              </span>
            </div>
          )}
        </div>
        <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
