import React from 'react';
import { SparklineDataPoint } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { LineSparkline } from './LineSparkline';
import { BarSparkline } from './BarSparkline';
import { AreaSparkline } from './AreaSparkline';
import { PieSparkline } from './PieSparkline';
import { DonutSparkline } from './DonutSparkline';

interface SparklineProps {
    dataPoints: SparklineDataPoint[];
    settings: SparklineColumnSettings;
}

export const Sparkline: React.FC<SparklineProps> = ({ dataPoints, settings }) => {
    const chartType = settings.chartType || 'line';

    switch (chartType) {
        case 'line':
            return <LineSparkline dataPoints={dataPoints} settings={settings} />;
        case 'bar':
            return <BarSparkline dataPoints={dataPoints} settings={settings} />;
        case 'area':
            return <AreaSparkline dataPoints={dataPoints} settings={settings} />;
        case 'pie':
            return <PieSparkline dataPoints={dataPoints} settings={settings} />;
        case 'donut':
            return <DonutSparkline dataPoints={dataPoints} settings={settings} />;
        default:
            return <LineSparkline dataPoints={dataPoints} settings={settings} />;
    }
};
