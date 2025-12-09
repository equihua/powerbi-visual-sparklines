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
import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;

import { VisualFormattingSettingsModel } from "./settings";
import { visualTransform } from "./visualTransform";
import { TableViewModel, TableRowData } from "./visualViewModel";

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

interface SparklineConfig {
    width: number;
    height: number;
    padding: number;
    strokeColor: string;
    strokeWidth: number;
}

const SPARKLINE_CONFIG: SparklineConfig = {
    width: 60,
    height: 20,
    padding: 2,
    strokeColor: "#0078D4",
    strokeWidth: 1.5
};

const DEFAULT_TEXT_SIZE = 12;
const SPARKLINE_COLUMN_TITLE = "Tendencia";

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
        this.updateFormattingSettings(options);

        const viewModel = visualTransform(options.dataViews);
        if (!viewModel) {
            this.clearContainer();
            return;
        }

        const textSize = this.getTextSize(options.dataViews?.[0]);
        this.renderTable(viewModel, textSize, options.viewport);
    }

    private updateFormattingSettings(options: VisualUpdateOptions): void {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews?.[0]
        );
    }

    private clearContainer(): void {
        this.container.selectAll("*").remove();
    }

    private renderTable(viewModel: TableViewModel, textSize: number, viewport: IViewport): void {
        this.clearContainer();

        const tableElement = this.createTableElement(textSize, viewport);
        this.renderTableHeader(tableElement, viewModel.columns);
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
        columns: powerbi.DataViewMetadataColumn[]
    ): void {
        const headerRow = tableElement
            .append("thead")
            .append("tr");

        columns.forEach(column => {
            headerRow.append("th").text(column.displayName);
        });

        headerRow.append("th").text(SPARKLINE_COLUMN_TITLE);
    }

    private renderTableBody(
        tableElement: Selection<HTMLTableElement>,
        rows: TableRowData[]
    ): void {
        const tbody = tableElement.append("tbody");

        rows.forEach(rowData => {
            this.renderTableRow(tbody, rowData);
        });
    }

    private renderTableRow(
        tbody: Selection<HTMLTableSectionElement>,
        rowData: TableRowData
    ): void {
        const tr = tbody.append("tr");

        rowData.cells.forEach(cell => {
            const formattedValue = this.formatValue(cell.value, cell.column);
            tr.append("td").text(formattedValue);
        });

        const sparklineTd = tr.append("td");
        if (rowData.numericValues.length > 1) {
            this.renderSparkline(sparklineTd, rowData.numericValues);
        }
    }

    private renderSparkline(container: Selection<HTMLTableCellElement>, data: number[]): void {
        const config = SPARKLINE_CONFIG;

        const svg = container
            .append("svg")
            .attr("width", config.width)
            .attr("height", config.height);

        const scales = this.createSparklineScales(data, config);
        const pathData = this.generateSparklinePath(data, scales);

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", config.strokeColor)
            .attr("stroke-width", config.strokeWidth)
            .attr("d", pathData);
    }

    private createSparklineScales(data: number[], config: SparklineConfig) {
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([config.padding, config.width - config.padding]);

        const minValue = min(data) ?? 0;
        const maxValue = max(data) ?? 0;
        const yScale = scaleLinear()
            .domain([minValue, maxValue])
            .range([config.height - config.padding, config.padding]);

        return { xScale, yScale };
    }

    private generateSparklinePath(
        data: number[],
        scales: { xScale: d3.ScaleLinear<number, number>; yScale: d3.ScaleLinear<number, number> }
    ): string | null {
        const lineGenerator = line<number>()
            .x((d, i) => scales.xScale(i))
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

    private getTextSize(dataView?: DataView): number {
        const textSize = dataView?.metadata?.objects?.["general"]?.["textSize"];
        return (textSize as number) ?? DEFAULT_TEXT_SIZE;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
