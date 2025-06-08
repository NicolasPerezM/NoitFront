// Import React library and hooks.
import * as React from "react";
// Import Recharts primitive components, which are the building blocks for charts.
import * as RechartsPrimitive from "recharts";

// Import utility function 'cn' for conditional class name joining.
import { cn } from "@/lib/utils";

// Define theme names and their corresponding CSS selectors.
// Used for generating theme-specific styles.
const THEMES = { light: "", dark: ".dark" } as const;

// Define the structure for chart configuration.
// Each key in ChartConfig corresponds to a data series in the chart.
export type ChartConfig = {
  [k in string]: { // Key is a string (e.g., "views", "clicks").
    label?: React.ReactNode; // Optional display label for the data series.
    icon?: React.ComponentType; // Optional icon component for the data series.
  } & ( // Union type for color definition:
    | { color?: string; theme?: never } // Either a single color string (applied to all themes).
    | { color?: never; theme: Record<keyof typeof THEMES, string> } // Or a theme object with color strings for light/dark themes.
  );
};

// Define props for the ChartContext.
type ChartContextProps = {
  config: ChartConfig; // The chart configuration object.
};

// Create a React context for chart configuration.
const ChartContext = React.createContext<ChartContextProps | null>(null);

// Custom hook to access the ChartContext.
// Throws an error if used outside of a <ChartContainer />.
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// ChartContainer component: Main wrapper for a chart.
// It provides context, generates a unique ID, and includes ChartStyle for theming.
// Accepts standard div props, a 'config' prop, and 'children' (typically Recharts components).
function ChartContainer({
  id, // Optional ID for the chart.
  className, // Optional additional CSS classes.
  children, // Chart components from Recharts.
  config, // Chart configuration object.
  ...props // Spread other div props.
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  // Generate a unique ID for the chart if not provided.
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    // Provide chart configuration through context.
    <ChartContext.Provider value={{ config }}>
      {/* Root div for the chart container. */}
      <div
        data-slot="chart" // Custom data attribute for styling.
        data-chart={chartId} // Data attribute with the chart's ID.
        // Apply Tailwind CSS classes for base styling and Recharts element overrides.
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props} // Spread other div props.
      >
        {/* Component to inject dynamic styles for chart colors based on config and theme. */}
        <ChartStyle id={chartId} config={config} />
        {/* Responsive container from Recharts to make the chart responsive. */}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ChartStyle component: Generates and injects CSS for chart colors.
// Uses the chart ID and configuration to create theme-specific CSS variables.
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // Filter out config entries that don't have color or theme information.
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  // If no color configuration is found, render nothing.
  if (!colorConfig.length) {
    return null;
  }

  return (
    // Style tag to inject CSS.
    // Uses dangerouslySetInnerHTML, which should be used with caution and trusted content.
    <style
      dangerouslySetInnerHTML={{
        // Generate CSS string.
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] { /* Apply styles based on theme prefix and chart ID. */
${colorConfig
  .map(([key, itemConfig]) => {
    // Determine color based on theme or default color.
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    // Create CSS variable for the color if available.
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// ChartTooltip: Re-export of RechartsPrimitive.Tooltip for convenience.
const ChartTooltip = RechartsPrimitive.Tooltip;

// ChartTooltipContent component: Custom content for chart tooltips.
// Provides styling and formatting for tooltip information.
function ChartTooltipContent({
  active, // Boolean indicating if the tooltip is active.
  payload, // Data payload for the tooltip.
  className, // Optional additional CSS classes.
  indicator = "dot", // Type of indicator to display ("dot", "line", "dashed").
  hideLabel = false, // Whether to hide the label in the tooltip.
  hideIndicator = false, // Whether to hide the color indicator.
  label, // Custom label for the tooltip.
  labelFormatter, // Custom formatter function for the label.
  labelClassName, // CSS class for the label.
  formatter, // Custom formatter function for item values.
  color, // Custom color for the indicator.
  nameKey, // Key to access item name from payload.
  labelKey, // Key to access label from payload.
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> & // Inherits Recharts Tooltip props.
  React.ComponentProps<"div"> & { // Inherits div props.
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }) {
  // Get chart configuration from context.
  const { config } = useChart();

  // Memoized calculation for the tooltip label.
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }
    if (!value) {
      return null;
    }
    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  // If tooltip is not active or no payload, render nothing.
  if (!active || !payload?.length) {
    return null;
  }

  // Determine if the label should be nested within item details (for single item tooltips with non-dot indicators).
  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    // Tooltip container with styling.
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {/* Render label if not nested. */}
      {!nestLabel ? tooltipLabel : null}
      {/* Grid for tooltip items. */}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            // Container for each item in the tooltip.
            <div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {/* Use custom formatter if provided. */}
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                // Default item rendering.
                <>
                  {/* Item icon or color indicator. */}
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          { // Indicator style based on 'indicator' prop.
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          { // Apply indicator color using CSS variables.
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  {/* Item label and value. */}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {/* Render nested label if applicable. */}
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {/* Item value, formatted with toLocaleString. */}
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ChartLegend: Re-export of RechartsPrimitive.Legend for convenience.
const ChartLegend = RechartsPrimitive.Legend;

// ChartLegendContent component: Custom content for chart legends.
// Provides styling for legend items, including icons and labels.
function ChartLegendContent({
  className, // Optional additional CSS classes.
  hideIcon = false, // Whether to hide the icon in the legend item.
  payload, // Legend payload from Recharts.
  verticalAlign = "bottom", // Vertical alignment of the legend.
  nameKey, // Key to access item name from payload.
}: React.ComponentProps<"div"> & // Inherits div props.
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & { // Picks specific props from Recharts LegendProps.
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  // Get chart configuration from context.
  const { config } = useChart();

  // If no payload, render nothing.
  if (!payload?.length) {
    return null;
  }

  return (
    // Legend container with styling.
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3", // Padding based on vertical alignment.
        className
      )}
    >
      {/* Map through legend payload to render each item. */}
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          // Container for each legend item.
          <div
            key={item.value} // Use item value as key.
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3" // Styling for item layout and icon.
            )}
          >
            {/* Item icon or color indicator. */}
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]" // Default color square.
                style={{
                  backgroundColor: item.color, // Apply item color.
                }}
              />
            )}
            {/* Item label from config or default. */}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper function to extract item configuration from a chart payload.
// This allows mapping data keys/names from the payload to specific configurations in ChartConfig.
function getPayloadConfigFromPayload(
  config: ChartConfig, // The main chart configuration.
  payload: unknown, // The payload item from Recharts (e.g., from tooltip or legend).
  key: string // The key to look up in the payload or config.
) {
  // Basic type check for payload.
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  // Check if the payload itself has a nested 'payload' object (common in Recharts).
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  // Attempt to find a more specific key for the label from the payload.
  // This allows dynamic mapping if the payload contains a key that points to the actual config key.
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  // Return the configuration for the determined key, or fallback to the original key.
  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

// Export all chart-related components.
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
