import React, { memo, useMemo } from 'react';
import { SparklineDataPoint } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';

interface PieSparklineProps {
    dataPoints: SparklineDataPoint[];
    settings: SparklineColumnSettings;
}

export const PieSparkline = memo<PieSparklineProps>(({ dataPoints, settings }) => {
    const size = 20;
    const radius = size / 2 - 2;
    const fillColor = settings.color || '#0078D4';

    const slices = useMemo(() => {
        const data = dataPoints.map(d => d.y);
        const total = data.reduce((sum, val) => sum + val, 0);
        let currentAngle = 0;

        return data.map((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;

            const x1 = radius + radius * Math.cos(currentAngle);
            const y1 = radius + radius * Math.sin(currentAngle);
            const x2 = radius + radius * Math.cos(endAngle);
            const y2 = radius + radius * Math.sin(endAngle);

            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const pathData = `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

            const opacity = 1 - (index * 0.2);

            currentAngle = endAngle;

            return { pathData, opacity, key: index };
        });
    }, [dataPoints, radius]);

    return (
        <svg width={size} height={size}>
            {slices.map(slice => (
                <path
                    key={slice.key}
                    d={slice.pathData}
                    fill={fillColor}
                    fillOpacity={slice.opacity}
                    stroke="#fff"
                    strokeWidth={0.5}
                />
            ))}
        </svg>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.dataPoints === nextProps.dataPoints &&
        prevProps.settings.color === nextProps.settings.color
    );
});

PieSparkline.displayName = 'PieSparkline';
