import React from "react";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import {
  area,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveBasis,
  curveCardinal,
} from "d3-shape";
import { SparklineDataPoint } from "../../visualViewModel";
import { SparklineColumnSettings } from "../../settings";

interface AreaSparklineProps {
  dataPoint: SparklineDataPoint[];
  settings: SparklineColumnSettings;
}

export const AreaSparkline: React.FC<AreaSparklineProps> = ({
  dataPoint,
  settings,
}) => {
  const width = 60;
  const height = 20;
  const padding = 2;
  const fillColor = settings.color || "#0078D4";
  const strokeWidth = settings.areaStrokeWidth ?? settings.lineWidth ?? 1.5;
  const fillOpacity = settings.areaFillOpacity ?? 0.3;
  const curveType = settings.areaCurveType ?? "linear";

  const data = dataPoint.map((d) => d.y);

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([padding, width - padding]);

  const minValue = min(data) ?? 0;
  const maxValue = max(data) ?? 0;
  const yScale = scaleLinear()
    .domain([minValue, maxValue])
    .range([height - padding, padding]);

  const getCurve = () => {
    switch (curveType) {
      case "monotone":
        return curveMonotoneX;
      case "step":
        return curveStep;
      case "basis":
        return curveBasis;
      case "cardinal":
        return curveCardinal;
      default:
        return curveLinear;
    }
  };

  const areaGenerator = area<number>()
    .x((_d, i) => xScale(i))
    .y0(height - padding)
    .y1((d) => yScale(d))
    .curve(getCurve());

  const areaPath = areaGenerator(data);

  return (
    <svg width={width} height={height}>
      <path
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={fillColor}
        strokeWidth={strokeWidth}
        d={areaPath || ""}
      />
    </svg>
  );
};
