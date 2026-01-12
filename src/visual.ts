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

import {
  type SparklineColumnSettings,
  type ColumnConfigSettings,
  VisualFormattingSettingsModel,
} from "./settings";
import { visualTransform } from "./visualTransform";
import { TableViewModel } from "./visualViewModel";
import { Table } from "./components/Table";

export class Visual implements IVisual {
  private readonly target: HTMLElement;
  private readonly reactRoot: HTMLDivElement;
  private root: Root | null = null;
  private sparklineSettings: Map<string, SparklineColumnSettings> = new Map();
  private columnSettings: Map<string, ColumnConfigSettings> = new Map();
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;

    this.reactRoot = document.createElement("div");
    this.reactRoot.className = "sparkline-container";
    this.target.appendChild(this.reactRoot);

    this.formattingSettingsService = new FormattingSettingsService();
    this.formattingSettings = new VisualFormattingSettingsModel();
  }

  public update(options: VisualUpdateOptions): void {
    console.log("Visual update", options);

    if (!options.dataViews || !options.dataViews[0]) {
      this.clearContainer();
      return;
    }

    const viewModel = visualTransform(options.dataViews);

    if (!viewModel || !viewModel.rows || viewModel.rows.length === 0) {
      this.clearContainer();
      return;
    }

    console.log("=== ViewModel ===");
    console.table(viewModel.rows);

    const firstRow = viewModel.rows[0];
    const sparklineColumnNames: string[] = [];
    const measureColumnNames: string[] = [];

    Object.keys(firstRow).forEach((key) => {
      const value = firstRow[key];
      if (
        value &&
        typeof value === "object" &&
        "Nombre" in value &&
        "Axis" in value &&
        "Values" in value
      ) {
        sparklineColumnNames.push(key);
      } else if (typeof value === "number") {
        measureColumnNames.push(key);
      }
    });

    console.log("Measure columns:", measureColumnNames);

    this.formattingSettings.updateSparklineCards(sparklineColumnNames);
    this.formattingSettings.updateColumnCards(measureColumnNames);

    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );

    this.formattingSettings.updateSparklineCards(sparklineColumnNames);
    this.formattingSettings.updateColumnCards(measureColumnNames);

    if (this.formattingSettings.columns) {
      const selectedColumn = this.formattingSettings.columns.columnSelector.value.value as string;
      this.formattingSettings.handleColumnSelectorChange(selectedColumn);
    }

    this.sparklineSettings.clear();
    sparklineColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getSparklineSettings(columnName);
      this.sparklineSettings.set(columnName, settings);
    });

    this.columnSettings.clear();
    measureColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getColumnSettings(columnName);
      this.columnSettings.set(columnName, settings);
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

    const defaultColumnSettings = this.formattingSettings.getColumnSettings("");

    this.root.render(
      React.createElement(Table, {
        viewModel: viewModel,
        textSize: this.formattingSettings.general.textSize.value,
        tableStyle: this.formattingSettings.general.tableStyle.value
          .value as string,
        showHorizontalLines:
          this.formattingSettings.grid.horizontalLinesGroup.showHorizontalLines.value,
        horizontalLineColor:
          this.formattingSettings.grid.horizontalLinesGroup.horizontalLineColor.value.value,
        horizontalLineWidth:
          this.formattingSettings.grid.horizontalLinesGroup.horizontalLineWidth.value,
        showVerticalLines: this.formattingSettings.grid.verticalLinesGroup.showVerticalLines.value,
        verticalLineColor:
          this.formattingSettings.grid.verticalLinesGroup.verticalLineColor.value.value,
        verticalLineWidth: this.formattingSettings.grid.verticalLinesGroup.verticalLineWidth.value,
        borderStyle: this.formattingSettings.grid.bordersGroup.borderStyle.value
          .value as string,
        borderColor: this.formattingSettings.grid.bordersGroup.borderColor.value.value,
        borderWidth: this.formattingSettings.grid.bordersGroup.borderWidth.value,
        borderSection: this.formattingSettings.grid.bordersGroup.borderSection.value
          .value as "all" | "header" | "rows",
        rowSelection: this.formattingSettings.interactivity.selectionGroup.rowSelection.value,
        rowSelectionColor:
          this.formattingSettings.interactivity.selectionGroup.rowSelectionColor.value.value,
        sortable: this.formattingSettings.interactivity.featuresGroup.sortable.value,
        freezeCategories:
          this.formattingSettings.interactivity.navigationGroup.freezeCategories.value,
        searchable: this.formattingSettings.interactivity.featuresGroup.searchable.value,
        pagination: this.formattingSettings.interactivity.navigationGroup.pagination.value,
        rowsPerPage: this.formattingSettings.interactivity.navigationGroup.rowsPerPage.value,
        fontFamily: this.formattingSettings.typography.fontFamily.value
          .value as string,
        wordWrap: true,
        textOverflow: "ellipsis" as "clip" | "ellipsis" | "wrap",
        headerAlignment: defaultColumnSettings.headerAlignment as "left" | "center" | "right",
        headerPadding: defaultColumnSettings.headerPadding,
        headerBold: defaultColumnSettings.headerBold,
        stickyHeader: false,
        headerFontColor: defaultColumnSettings.headerFontColor,
        headerFontSize: defaultColumnSettings.headerFontSize,
        headerBackgroundColor: defaultColumnSettings.headerBackgroundColor,
        rowHeight: this.formattingSettings.rows.rowDimensionsGroup.rowHeight.value,
        alternatingRowColor:
          this.formattingSettings.rows.rowColorsGroup.alternatingRowColor.value.value,
        hoverBackgroundColor:
          this.formattingSettings.rows.rowEffectsGroup.hoverBackgroundColor.value.value,
        rowPadding: this.formattingSettings.rows.rowDimensionsGroup.rowPadding.value,
        categoryColumnAlignment: defaultColumnSettings.cellAlignment as "left" | "center" | "right",
        categoryCellAlignment: defaultColumnSettings.cellAlignment as "left" | "center" | "right",
        categoryCellPadding: defaultColumnSettings.cellPadding,
        categoryCellFontColor: defaultColumnSettings.cellFontColor,
        categoryCellFontSize: defaultColumnSettings.cellFontSize,
        categoryCellBackgroundColor: defaultColumnSettings.cellBackgroundColor,
        measureCellAlignment: defaultColumnSettings.cellAlignment as "left" | "center" | "right",
        measureCellPadding: defaultColumnSettings.cellPadding,
        measureCellFontColor: defaultColumnSettings.cellFontColor,
        measureCellFontSize: defaultColumnSettings.cellFontSize,
        measureCellBackgroundColor: defaultColumnSettings.cellBackgroundColor,
        decimalPlaces: defaultColumnSettings.decimalPlaces,
        thousandsSeparator: defaultColumnSettings.thousandsSeparator,
        currencySymbol: defaultColumnSettings.prefix,
        currencyPosition: "before" as "before" | "after",
        negativeNumberFormat: "minus" as "minus" | "parentheses" | "minusred" | "parenthesesred",
        customNegativeColor: "#FF0000",
        sparklineSettings: this.sparklineSettings,
        columnSettings: this.columnSettings,
        width: viewport.width,
      })
    );
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
