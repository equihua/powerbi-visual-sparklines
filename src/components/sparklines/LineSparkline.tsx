import React, { useRef, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { line } from "d3-shape";
import { SparklineDataPoint } from "../../visualViewModel";
import { SparklineColumnSettings } from "../../settings";

interface LineSparklineProps {
  dataPoints: SparklineDataPoint[];
  settings: SparklineColumnSettings;
}

export const LineSparkline: React.FC<LineSparklineProps> = ({
  dataPoints,
  settings,
}) => {
  const width = 60;
  const height = 20;
  const padding = 2;
  const strokeColor = settings.color || "#0078D4";
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

  const lineGenerator = line<number>()
    .x((_d, i) => xScale(i))
    .y((d) => yScale(d));

  const pathData = lineGenerator(data);

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        d={pathData || ""}
      />
    </svg>
  );
};
