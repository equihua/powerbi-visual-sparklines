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
import { TableContainer } from "./components/TableContainer";
import { generateHash } from "./utils/memoization";

export class Visual implements IVisual {
  private readonly target: HTMLElement;
  private readonly reactRoot: HTMLDivElement;
  private root: Root | null = null;
  private sparklineSettings: Map<string, SparklineColumnSettings> = new Map();
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  private previousSparklineHash: string = "";
  private previousViewModelHash: string = "";

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

    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );

    console.log("=== Formatting Settings ===", this.formattingSettings);

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

    const newSparklineHash = generateHash({
      columns: sparklineColumnNames.sort(),
      settings: sparklineColumnNames.map((col) =>
        this.formattingSettings.getSparklineSettings(col)
      ),
    });

    if (newSparklineHash !== this.previousSparklineHash) {
      this.sparklineSettings.clear();
      sparklineColumnNames.forEach((columnName) => {
        const settings =
          this.formattingSettings.getSparklineSettings(columnName);
        this.sparklineSettings.set(columnName, settings);
      });
      this.previousSparklineHash = newSparklineHash;
    }

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
      React.createElement(TableContainer, {
        viewModel,
        formattingSettings: this.formattingSettings,
        sparklineSettings: this.sparklineSettings,
        viewport,
      })
    );
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
