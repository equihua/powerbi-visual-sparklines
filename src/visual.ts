/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

"use strict";

import { select } from "d3-selection";
import { line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

import { VisualFormattingSettingsModel } from "./settings";
import { visualTransform } from "./visualTransform";
import { TableViewModel, TableRowData, SparklineDataPoint } from "./visualViewModel";

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private readonly target: HTMLElement;
    private readonly container: Selection<HTMLDivElement>;
    private readonly formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualFormattingSettingsModel;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.container = select(this.target)
            .append("div")
            .classed("pbi-table-container", true);
    }

    public update(options: VisualUpdateOptions): void {
        const viewModel = visualTransform(options.dataViews);
        if (!viewModel) {
            this.clearContainer();
            return;
        }

        if (!this.formattingSettings) {
            this.formattingSettings = new VisualFormattingSettingsModel();
            this.formattingSettings.populateSparklineCards(viewModel.sparklineColumns);
        }

        const dataView = options.dataViews[0];

        if (dataView?.metadata?.objects) {
            this.formattingSettings.sparklineCards.forEach(card => {
                const cardSettings = dataView.metadata.objects[card.name];
                if (cardSettings) {
                    console.log(`Loading settings for ${card.name}:`, cardSettings);

                    if (cardSettings["chartType"]) {
                        card.chartType.value = cardSettings["chartType"] as any;
                    }
                    if (cardSettings["color"]) {
                        card.color.value = cardSettings["color"] as any;
                    }
                    if (cardSettings["lineWidth"]) {
                        card.lineWidth.value = cardSettings["lineWidth"] as number;
                    }
                }
            });

            const generalSettings = dataView.metadata.objects["general"];
            if (generalSettings) {
                if (generalSettings["textSize"]) {
                    this.formattingSettings.general.textSize.value = generalSettings["textSize"] as number;
                }
                if (generalSettings["alternateRowColor"]) {
                    this.formattingSettings.general.alternateRowColor.value = generalSettings["alternateRowColor"] as any;
                }
            }
        }

        console.log("Final formatting settings:", this.formattingSettings);
        console.log("Sparkline cards after loading:", this.formattingSettings.sparklineCards.map(c => ({
            name: c.name,
            chartType: c.chartType.value,
            color: c.color.value,
            lineWidth: c.lineWidth.value
        })));

        this.renderTable(viewModel, options.viewport);
    }

    private clearContainer(): void {
        this.container.selectAll("*").remove();
    }

    private renderTable(viewModel: TableViewModel, viewport: IViewport): void {
        this.clearContainer();

        const textSize = this.formattingSettings.general.textSize.value;
        const tableElement = this.createTableElement(textSize, viewport);
        this.renderTableHeader(tableElement, viewModel.columns, viewModel.sparklineColumns);
        this.renderTableBody(tableElement, viewModel.rows);
    }

    private createTableElement(textSize: number, viewport: IViewport): Selection<HTMLTableElement> {
        return this.container
            .append("table")
            .classed("pbi-custom-table", true)
            .style("font-size", `${textSize}px`)
            .style("width", `${viewport.width}px`);
    }

    private renderTableHeader(
        tableElement: Selection<HTMLTableElement>,
        columns: powerbi.DataViewMetadataColumn[],
        sparklineColumns: powerbi.DataViewMetadataColumn[]
    ): void {
        const headerRow = tableElement
            .append("thead")
            .append("tr");

        columns.forEach(column => {
            headerRow.append("th").text(column.displayName);
        });

        sparklineColumns.forEach(column => {
            headerRow.append("th").text(column.displayName);
        });
    }

    private renderTableBody(
        tableElement: Selection<HTMLTableElement>,
        rows: TableRowData[]
    ): void {
        const tbody = tableElement.append("tbody");
        const alternateColor = this.formattingSettings.general.alternateRowColor.value.value;

        rows.forEach((rowData, index) => {
            this.renderTableRow(tbody, rowData, index, alternateColor);
        });
    }

    private renderTableRow(
        tbody: Selection<HTMLTableSectionElement>,
        rowData: TableRowData,
        index: number,
        alternateColor: string
    ): void {
        const tr = tbody.append("tr");

        if (index % 2 === 1) {
            tr.style("background-color", alternateColor);
        }

        rowData.cells.forEach(cell => {
            const formattedValue = this.formatValue(cell.value, cell.column);
            tr.append("td").text(formattedValue);
        });

        rowData.sparklineColumns.forEach((sparklineData, sparklineIndex) => {
            const sparklineTd = tr.append("td");
            console.log(`Sparkline ${sparklineIndex}:`, sparklineData.dataPoints.length, "points", sparklineData.dataPoints);
            if (sparklineData.dataPoints.length > 0) {
                const settings = this.formattingSettings.sparklineCards[sparklineIndex];
                console.log(`Rendering sparkline with settings:`, settings?.chartType?.value);
                this.renderSparkline(sparklineTd, sparklineData.dataPoints, settings);
            }
        });
    }

    private renderSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        console.log("renderSparkline called with settings:", {
            chartType: settings?.chartType?.value?.value,
            color: settings?.color?.value?.value,
            lineWidth: settings?.lineWidth?.value
        });

        const chartType = settings?.chartType?.value?.value || "line";

        switch (chartType) {
            case "line":
                this.renderLineSparkline(container, dataPoints, settings);
                break;
            case "bar":
                this.renderBarSparkline(container, dataPoints, settings);
                break;
            case "area":
                this.renderAreaSparkline(container, dataPoints, settings);
                break;
            case "pie":
                this.renderPieSparkline(container, dataPoints, settings);
                break;
            case "donut":
                this.renderDonutSparkline(container, dataPoints, settings);
                break;
            default:
                this.renderLineSparkline(container, dataPoints, settings);
        }
    }

    private renderLineSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        const width = 60;
        const height = 20;
        const padding = 2;
        const strokeColor = settings?.color?.value?.value || "#0078D4";
        const strokeWidth = settings?.lineWidth?.value || 1.5;

        console.log("renderLineSparkline - strokeColor:", strokeColor, "strokeWidth:", strokeWidth);

        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const data = dataPoints.map(d => d.y);
        const scales = this.createSparklineScales(data, width, height, padding);
        const pathData = this.generateSparklinePath(data, scales);

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", pathData);
    }

    private renderBarSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        const width = 60;
        const height = 20;
        const padding = 2;
        const fillColor = settings?.color?.value?.value || "#0078D4";

        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const data = dataPoints.map(d => d.y);
        const xScale = scaleLinear()
            .domain([0, data.length])
            .range([padding, width - padding]);

        const maxValue = max(data) ?? 0;
        const yScale = scaleLinear()
            .domain([0, maxValue])
            .range([height - padding, padding]);

        const barWidth = (width - 2 * padding) / data.length - 1;

        data.forEach((value, index) => {
            svg.append("rect")
                .attr("x", xScale(index))
                .attr("y", yScale(value))
                .attr("width", barWidth)
                .attr("height", height - padding - yScale(value))
                .attr("fill", fillColor);
        });
    }

    private renderAreaSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        const width = 60;
        const height = 20;
        const padding = 2;
        const fillColor = settings?.color?.value?.value || "#0078D4";
        const strokeWidth = settings?.lineWidth?.value || 1.5;

        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const data = dataPoints.map(d => d.y);
        const scales = this.createSparklineScales(data, width, height, padding);

        const areaPoints = data.map((d, i) =>
            `${scales.xScale(i)},${scales.yScale(d)}`
        ).join(" ");

        const baselineY = height - padding;
        const areaPath = `M${padding},${baselineY} L${areaPoints} L${width - padding},${baselineY} Z`;

        svg.append("path")
            .attr("fill", fillColor)
            .attr("fill-opacity", 0.3)
            .attr("stroke", fillColor)
            .attr("stroke-width", strokeWidth)
            .attr("d", areaPath);
    }

    private renderPieSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        const size = 20;
        const radius = size / 2 - 2;
        const fillColor = settings?.color?.value?.value || "#0078D4";

        const svg = container
            .append("svg")
            .attr("width", size)
            .attr("height", size);

        const data = dataPoints.map(d => d.y);
        const total = data.reduce((sum, val) => sum + val, 0);
        let currentAngle = 0;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;

            const x1 = radius + radius * Math.cos(currentAngle);
            const y1 = radius + radius * Math.sin(currentAngle);
            const x2 = radius + radius * Math.cos(endAngle);
            const y2 = radius + radius * Math.sin(endAngle);

            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const pathData = `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

            const opacity = 1 - (index * 0.2);
            svg.append("path")
                .attr("d", pathData)
                .attr("fill", fillColor)
                .attr("fill-opacity", opacity)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5);

            currentAngle = endAngle;
        });
    }

    private renderDonutSparkline(
        container: Selection<HTMLTableCellElement>,
        dataPoints: SparklineDataPoint[],
        settings: any
    ): void {
        const size = 20;
        const outerRadius = size / 2 - 2;
        const innerRadius = outerRadius * 0.5;
        const fillColor = settings?.color?.value?.value || "#0078D4";

        const svg = container
            .append("svg")
            .attr("width", size)
            .attr("height", size);

        const data = dataPoints.map(d => d.y);
        const total = data.reduce((sum, val) => sum + val, 0);
        let currentAngle = 0;

        data.forEach((value, index) => {
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
            svg.append("path")
                .attr("d", pathData)
                .attr("fill", fillColor)
                .attr("fill-opacity", opacity)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5);

            currentAngle = endAngle;
        });
    }

    private createSparklineScales(data: number[], width: number, height: number, padding: number) {
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([padding, width - padding]);

        const minValue = min(data) ?? 0;
        const maxValue = max(data) ?? 0;
        const yScale = scaleLinear()
            .domain([minValue, maxValue])
            .range([height - padding, padding]);

        return { xScale, yScale };
    }

    private generateSparklinePath(
        data: number[],
        scales: { xScale: d3.ScaleLinear<number, number>; yScale: d3.ScaleLinear<number, number> }
    ): string | null {
        const lineGenerator = line<number>()
            .x((_d, i) => scales.xScale(i))
            .y(d => scales.yScale(d));

        return lineGenerator(data);
    }

    private formatValue(value: any, column: powerbi.DataViewMetadataColumn): string {
        if (value == null) {
            return "";
        }

        if (typeof value === "number") {
            return this.formatNumericValue(value, column.format);
        }

        if (value instanceof Date) {
            return value.toLocaleDateString();
        }

        return String(value);
    }

    private formatNumericValue(value: number, format?: string): string {
        if (format?.includes("%")) {
            return `${(value * 100).toFixed(2)}%`;
        }

        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
