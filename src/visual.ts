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

import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { SparklineColumnSettings, VisualFormattingSettingsModel } from "./settings";
import { visualTransform } from "./visualTransform";
import { TableViewModel } from "./visualViewModel";
import { SparklineTable } from "./components/SparklineTable";

export class Visual implements IVisual {
    private readonly target: HTMLElement;
    private readonly reactRoot: HTMLDivElement;
    private root: Root | null = null;
    private host: IVisualHost;
    private sparklineColumns: powerbi.DataViewMetadataColumn[] = [];
    private sparklineSettings: Map<string, SparklineColumnSettings> = new Map();
    private generalSettings: {
        textSize: number;
        alternateRowColor: boolean;
    };
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.target = options.element;

        this.reactRoot = document.createElement("div");
        this.reactRoot.className = "pbi-table-container";
        this.target.appendChild(this.reactRoot);

        this.generalSettings = {
            textSize: 12,
            alternateRowColor: true
        };

        this.formattingSettingsService = new FormattingSettingsService();
        this.formattingSettings = new VisualFormattingSettingsModel();
    }

    public update(options: VisualUpdateOptions): void {
        const viewModel = visualTransform(options.dataViews);
        if (!viewModel) {
            this.clearContainer();
            return;
        }

        const dataView = options.dataViews[0];
        this.sparklineColumns = viewModel.sparklineColumns;

        this.formattingSettings.updateSparklineCards(this.sparklineColumns);

        if (dataView?.metadata?.objects) {
            const generalObjects = dataView.metadata.objects["general"];
            if (generalObjects) {
                if (generalObjects["textSize"] !== undefined) {
                    this.generalSettings.textSize = generalObjects["textSize"] as number;
                }
                if (generalObjects["alternateRowColor"] !== undefined) {
                    this.generalSettings.alternateRowColor = generalObjects["alternateRowColor"] as boolean;
                }
            }
        }

        this.sparklineColumns.forEach((column, index) => {
            const columnKey = column.queryName || column.displayName || `column${index}`;
            const columnObjects = column.objects;

            const settings: SparklineColumnSettings = {
                chartType: "line",
                color: "#0078D4",
                lineWidth: 1.5
            };

            if (columnObjects && columnObjects["sparklineColumn"]) {
                const sparklineObj = columnObjects["sparklineColumn"];
                if (sparklineObj["chartType"]) {
                    settings.chartType = sparklineObj["chartType"] as string;
                }
                if (sparklineObj["color"]) {
                    const colorValue = sparklineObj["color"] as any;
                    settings.color = colorValue.solid?.color || colorValue;
                }
                if (sparklineObj["lineWidth"]) {
                    settings.lineWidth = sparklineObj["lineWidth"] as number;
                }
            }

            this.sparklineSettings.set(columnKey, settings);
            this.formattingSettings.setSparklineSettings(columnKey, settings);
        });

        this.renderTable(viewModel, options.viewport);
    }

    private clearContainer(): void {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }

    private renderTable(viewModel: TableViewModel, viewport: IViewport): void {
        if (!this.root) {
            this.root = createRoot(this.reactRoot);
        }

        this.root.render(
            React.createElement(SparklineTable, {
                viewModel: viewModel,
                textSize: this.generalSettings.textSize,
                alternateRowColor: this.generalSettings.alternateRowColor,
                sparklineSettings: this.sparklineSettings,
                width: viewport.width
            })
        );
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
