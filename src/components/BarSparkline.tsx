import React from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { SparklineDataPoint } from "../visualViewModel";
import { SparklineColumnSettings } from "../settings";

interface BarSparklineProps {
  dataPoints: SparklineDataPoint[];
  settings: SparklineColumnSettings;
}

export const BarSparkline: React.FC<BarSparklineProps> = ({
  dataPoints,
  settings,
}) => {
  const width = 60;
  const height = 20;
  const padding = 2;
  const fillColor = settings.color || "#0078D4";

  const data = dataPoints.map((d) => d.y);

  const xScale = scaleLinear()
    .domain([0, data.length])
    .range([padding, width - padding]);

  const maxValue = max(data) ?? 0;
  const yScale = scaleLinear()
    .domain([0, maxValue])
    .range([height - padding, padding]);

  const barWidth = (width - 2 * padding) / data.length - 1;

  return (
    <svg width={width} height={height}>
      {data.map((value, index) => (
        <rect
          key={index}
          x={xScale(index)}
          y={yScale(value)}
          width={barWidth}
          height={height - padding - yScale(value)}
          fill={fillColor}
        />
      ))}
    </svg>
  );
};
