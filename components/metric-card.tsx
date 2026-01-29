import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  variant = 'default',
}: MetricCardProps) {
  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/20 bg-primary/5',
    secondary: 'border-secondary/20 bg-secondary/5',
    accent: 'border-accent/20 bg-accent/5',
  };

  return (
    <Card
      className={cn('transition-all hover:shadow-md', variantStyles[variant])}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {trend && (
          <p
            className={cn(
              'text-xs mt-1',
              trend.isPositive ? 'text-primary' : 'text-destructive',
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last
            period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
