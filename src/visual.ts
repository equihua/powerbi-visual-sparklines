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
      }
    });

    this.formattingSettings.updateSparklineCards(sparklineColumnNames);

    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );

    this.formattingSettings.updateSparklineCards(sparklineColumnNames);

    this.sparklineSettings.clear();
    sparklineColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getSparklineSettings(columnName);
      this.sparklineSettings.set(columnName, settings);
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
      React.createElement(Table, {
        viewModel: viewModel,
        textSize: this.formattingSettings.general.textSize.value,
        tableStyle: this.formattingSettings.general.tableStyle.value
          .value as string,
        showHorizontalLines:
          this.formattingSettings.grid.showHorizontalLines.value,
        horizontalLineColor:
          this.formattingSettings.grid.horizontalLineColor.value.value,
        horizontalLineWidth:
          this.formattingSettings.grid.horizontalLineWidth.value,
        showVerticalLines: this.formattingSettings.grid.showVerticalLines.value,
        verticalLineColor:
          this.formattingSettings.grid.verticalLineColor.value.value,
        verticalLineWidth: this.formattingSettings.grid.verticalLineWidth.value,
        borderStyle: this.formattingSettings.advancedBorders.borderStyle.value
          .value as string,
        borderColor: this.formattingSettings.grid.borderColor.value.value,
        borderWidth: this.formattingSettings.grid.borderWidth.value,
        borderSection: this.formattingSettings.grid.borderSection.value
          .value as "all" | "header" | "rows",
        rowSelection: this.formattingSettings.interactivity.rowSelection.value,
        rowSelectionColor:
          this.formattingSettings.interactivity.rowSelectionColor.value.value,
        sortable: this.formattingSettings.interactivity.sortable.value,
        freezeCategories:
          this.formattingSettings.interactivity.freezeCategories.value,
        searchable: this.formattingSettings.interactivity.searchable.value,
        pagination: this.formattingSettings.interactivity.pagination.value,
        rowsPerPage: this.formattingSettings.interactivity.rowsPerPage.value,
        fontFamily: this.formattingSettings.typography.fontFamily.value
          .value as string,
        wordWrap: this.formattingSettings.spacing.wordWrap.value,
        textOverflow: this.formattingSettings.spacing.textOverflow.value
          .value as "clip" | "ellipsis" | "wrap",
        headerAlignment: this.formattingSettings.headerFormatting
          .headerAlignment.value.value as "left" | "center" | "right",
        headerPadding:
          this.formattingSettings.headerFormatting.headerPadding.value,
        headerBold: this.formattingSettings.headerFormatting.headerBold.value,
        stickyHeader: this.formattingSettings.headerAdvanced.stickyHeader.value,
        headerFontColor:
          this.formattingSettings.columnHeader.fontColor.value.value,
        headerFontSize: this.formattingSettings.columnHeader.fontSize.value,
        headerBackgroundColor:
          this.formattingSettings.columnHeader.backgroundColor.value.value,
        rowHeight: this.formattingSettings.rows.rowHeight.value,
        alternatingRowColor:
          this.formattingSettings.rows.alternatingRowColor.value.value,
        hoverBackgroundColor:
          this.formattingSettings.rows.hoverBackgroundColor.value.value,
        rowPadding: this.formattingSettings.rows.rowPadding.value,
        categoryColumnAlignment: this.formattingSettings.categoryColumn
          .alignment.value.value as "left" | "center" | "right",
        categoryCellAlignment: this.formattingSettings.categoryCell.alignment
          .value.value as "left" | "center" | "right",
        categoryCellPadding: this.formattingSettings.categoryCell.padding.value,
        categoryCellFontColor:
          this.formattingSettings.categoryCell.fontColor.value.value,
        categoryCellFontSize:
          this.formattingSettings.categoryCell.fontSize.value,
        categoryCellBackgroundColor:
          this.formattingSettings.categoryCell.backgroundColor.value.value,
        measureCellAlignment: this.formattingSettings.measureCell.alignment
          .value.value as "left" | "center" | "right",
        measureCellPadding: this.formattingSettings.measureCell.padding.value,
        measureCellFontColor:
          this.formattingSettings.measureCell.fontColor.value.value,
        measureCellFontSize: this.formattingSettings.measureCell.fontSize.value,
        measureCellBackgroundColor:
          this.formattingSettings.measureCell.backgroundColor.value.value,
        decimalPlaces:
          this.formattingSettings.cellFormatting.decimalPlaces.value,
        thousandsSeparator:
          this.formattingSettings.cellFormatting.thousandsSeparator.value,
        currencySymbol: this.formattingSettings.numberFormatting.currencySymbol
          .value.value as string,
        currencyPosition: this.formattingSettings.numberFormatting
          .currencyPosition.value.value as "before" | "after",
        negativeNumberFormat: this.formattingSettings.numberFormatting
          .negativeNumberFormat.value.value as
          | "minus"
          | "parentheses"
          | "minusred"
          | "parenthesesred",
        customNegativeColor:
          this.formattingSettings.numberFormatting.customNegativeColor.value
            .value,
        sparklineSettings: this.sparklineSettings,
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
