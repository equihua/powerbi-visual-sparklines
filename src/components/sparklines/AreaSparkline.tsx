import React from "react";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { SparklineDataPoint } from "../../visualViewModel";
import { SparklineColumnSettings } from "../../settings";

interface AreaSparklineProps {
  dataPoints: SparklineDataPoint[];
  settings: SparklineColumnSettings;
}

export const AreaSparkline: React.FC<AreaSparklineProps> = ({
  dataPoints,
  settings,
}) => {
  const width = 60;
  const height = 20;
  const padding = 2;
  const fillColor = settings.color || "#0078D4";
  const strokeWidth = settings.lineWidth || 1.5;

  const data = dataPoints.map((d) => d.y);

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([padding, width - padding]);

  const minValue = min(data) ?? 0;
  const maxValue = max(data) ?? 0;
  const yScale = scaleLinear()
    .domain([minValue, maxValue])
    .range([height - padding, padding]);

  const areaPoints = data.map((d, i) => `${xScale(i)},${yScale(d)}`).join(" ");

  const baselineY = height - padding;
  const areaPath = `M${padding},${baselineY} L${areaPoints} L${
    width - padding
  },${baselineY} Z`;

  return (
    <svg width={width} height={height}>
      <path
        fill={fillColor}
        fillOpacity={0.3}
        stroke={fillColor}
        strokeWidth={strokeWidth}
        d={areaPath}
      />
    </svg>
  );
};
