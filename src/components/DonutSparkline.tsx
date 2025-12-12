import React, { memo, useMemo } from 'react';
import { SparklineDataPoint } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';

interface DonutSparklineProps {
    dataPoints: SparklineDataPoint[];
    settings: SparklineColumnSettings;
}

export const DonutSparkline = memo<DonutSparklineProps>(({ dataPoints, settings }) => {
    const size = 20;
    const outerRadius = size / 2 - 2;
    const innerRadius = outerRadius * 0.5;
    const fillColor = settings.color || '#0078D4';

    const slices = useMemo(() => {
        const data = dataPoints.map(d => d.y);
        const total = data.reduce((sum, val) => sum + val, 0);
        let currentAngle = 0;

        return data.map((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;

            const x1Outer = outerRadius + outerRadius * Math.cos(currentAngle);
            const y1Outer = outerRadius + outerRadius * Math.sin(currentAngle);
            const x2Outer = outerRadius + outerRadius * Math.cos(endAngle);
            const y2Outer = outerRadius + outerRadius * Math.sin(endAngle);

            const x1Inner = outerRadius + innerRadius * Math.cos(currentAngle);
            const y1Inner = outerRadius + innerRadius * Math.sin(currentAngle);
            const x2Inner = outerRadius + innerRadius * Math.cos(endAngle);
            const y2Inner = outerRadius + innerRadius * Math.sin(endAngle);

            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const pathData = `M ${x1Outer},${y1Outer} A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${x2Outer},${y2Outer} L ${x2Inner},${y2Inner} A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${x1Inner},${y1Inner} Z`;

            const opacity = 1 - (index * 0.2);

            currentAngle = endAngle;

            return { pathData, opacity, key: index };
        });
    }, [dataPoints, outerRadius, innerRadius]);

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

DonutSparkline.displayName = 'DonutSparkline';
