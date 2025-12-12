import React, { memo, useMemo } from 'react';
import { SparklineDataPoint } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { Sparkline } from './Sparkline';

interface SparklineCellProps {
    dataPoints: SparklineDataPoint[];
    settings: SparklineColumnSettings;
}

export const SparklineCell = memo<SparklineCellProps>(({ dataPoints, settings }) => {
    const memoizedDataPoints = useMemo(() => dataPoints, [dataPoints]);
    
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '4px'
        }}>
            <Sparkline dataPoints={memoizedDataPoints} settings={settings} />
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.dataPoints === nextProps.dataPoints &&
        prevProps.settings.chartType === nextProps.settings.chartType &&
        prevProps.settings.color === nextProps.settings.color &&
        prevProps.settings.lineWidth === nextProps.settings.lineWidth
    );
});

SparklineCell.displayName = 'SparklineCell';
