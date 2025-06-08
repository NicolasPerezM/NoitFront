// Import Card components from a custom UI library.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Import utility function 'cn' for conditional class name joining (likely from clsx or similar).
import { cn } from "@/lib/utils";
// Import LucideIcon type for icon components from lucide-react.
import type { LucideIcon } from "lucide-react";

// Define the props interface for the MetricCard component.
interface MetricCardProps {
  title: string; // The main title of the metric card.
  value: string | number; // The value of the metric to be displayed.
  icon: LucideIcon; // The icon component to be displayed on the card.
  description?: string; // Optional description text for the metric.
  trend?: { // Optional trend data for the metric.
    value: number; // The percentage value of the trend.
    isPositive: boolean; // Boolean indicating if the trend is positive or negative.
  };
  className?: string; // Optional additional CSS classes for custom styling.
}

// MetricCard component definition.
// This component displays a single metric in a card format, including a title, value, icon,
// an optional description, and an optional trend indicator.
export function MetricCard({ title, value, icon: Icon, description, trend, className }: MetricCardProps) {
  // 'icon: Icon' renames the 'icon' prop to 'Icon' for use as a component.
  return (
    // Root Card component.
    // Uses 'cn' to merge default classes with any provided 'className' prop.
    // Default classes include overflow control, transitions, and shadow effects on hover.
    <Card className={cn("overflow-hidden transition-all hover:shadow-md shadow-md", className)}>
      {/* CardHeader component for the top section of the card.
          Styled as a flex row, aligning items, justifying space between them, and removing bottom padding. */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* CardTitle for the metric's title.
            Styled with specific text size, font weight, and color. */}
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {/* Icon component, rendered with specified height, width, and color. */}
        <Icon className="h-8 w-8 text-muted-foreground" />
      </CardHeader>
      {/* CardContent for the main body of the card. */}
      <CardContent>
        {/* Displays the metric value with large, bold text. */}
        <div className="text-2xl font-bold">{value}</div>
        {/* Conditionally renders the description if provided.
            Styled with top margin and small text size. */}
        {description && <CardDescription className="mt-1 text-xs">{description}</CardDescription>}
        {/* Conditionally renders the trend information if provided. */}
        {trend && (
          // Paragraph for the trend text.
          // Uses 'cn' to apply base text styles and dynamic color based on 'trend.isPositive'.
          // Text color is emerald (green) for positive trends, rose (red) for negative.
          <p className={cn("mt-1 text-xs", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
            {/* Displays a "+" or "-" sign based on the trend direction. */}
            {trend.isPositive ? "+" : "-"}
            {/* Displays the trend value and a static text suffix. */}
            {trend.value}% desde el último periodo
          </p>
        )}
      </CardContent>
    </Card>
  );
}