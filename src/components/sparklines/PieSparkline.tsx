import React from "react";
import { SparklineDataPoint } from "../../visualViewModel";
import { SparklineColumnSettings } from "../../settings";

interface PieSparklineProps {
  dataPoint: SparklineDataPoint[];
  settings: SparklineColumnSettings;
}

export const PieSparkline: React.FC<PieSparklineProps> = ({
  dataPoint,
  settings,
}) => {
  const size = 20;
  const radius = size / 2 - 2;
  const fillColor = settings.color || "#0078D4";
  const startAngle = (settings.pieStartAngle ?? 0) * (Math.PI / 180);
  const showLabels = settings.pieShowLabels ?? false;
  const labelPosition = settings.pieLabelPosition ?? "outside";

  const data = dataPoint.map((d) => d.y);
  const total = data.reduce((sum, val) => sum + val, 0);
  let currentAngle = startAngle;

  const slices = data.map((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;

    const x1 = radius + radius * Math.cos(currentAngle);
    const y1 = radius + radius * Math.sin(currentAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

    const opacity = 1 - index * 0.2;

    const midAngle = currentAngle + sliceAngle / 2;
    const labelRadius =
      labelPosition === "inside" ? radius * 0.6 : radius * 1.2;
    const labelX = radius + labelRadius * Math.cos(midAngle);
    const labelY = radius + labelRadius * Math.sin(midAngle);

    currentAngle = endAngle;

    return { pathData, opacity, key: index, labelX, labelY, value };
  });

  return (
    <svg width={size} height={size}>
      {slices.map((slice) => (
        <g key={slice.key}>
          <path
            d={slice.pathData}
            fill={fillColor}
            fillOpacity={slice.opacity}
            stroke="#fff"
            strokeWidth={0.5}
          />
          {showLabels && (
            <text
              x={slice.labelX}
              y={slice.labelY}
              fontSize="4"
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {slice.value.toFixed(0)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};
