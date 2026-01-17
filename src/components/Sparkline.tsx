import React from "react";
import { SparklineData, SparklineDataPoint } from "../visualViewModel";
import { SparklineColumnSettings } from "../settings";
import { LineSparkline } from "./sparklines/LineSparkline";
import { BarSparkline } from "./sparklines/BarSparkline";
import { AreaSparkline } from "./sparklines/AreaSparkline";
import { PieSparkline } from "./sparklines/PieSparkline";
import { DonutSparkline } from "./sparklines/DonutSparkline";

interface SparklineProps {
  sparklineData: SparklineData;
  settings: SparklineColumnSettings;
}

export const Sparkline: React.FC<SparklineProps> = ({
  sparklineData,
  settings,
}) => {
  const chartType = settings.chartType || "line";

  console.log(`[Sparkline] Rendering with chartType: ${chartType}`, settings);

  const dataPoints: SparklineDataPoint[] = sparklineData.Values.map(
    (value, index) => ({
      x: sparklineData.Axis[index] || index,
      y: value,
    }),
  );

  switch (chartType) {
    case "line":
      return <LineSparkline dataPoint={dataPoints} settings={settings} />;
    case "bar":
      return <BarSparkline dataPoint={dataPoints} settings={settings} />;
    case "area":
      return <AreaSparkline dataPoint={dataPoints} settings={settings} />;
    case "pie":
      return <PieSparkline dataPoint={dataPoints} settings={settings} />;
    case "donut":
      return <DonutSparkline dataPoint={dataPoints} settings={settings} />;
    default:
      return <LineSparkline dataPoint={dataPoints} settings={settings} />;
  }
};
