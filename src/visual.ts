import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

import { visualTransform } from "./visualTransform";
import { TableViewModel } from "./visualViewModel";
import { TableContainer } from "./components/TableContainer";
import { FormattingManager } from "./formatters/FormattingManager";

export class Visual implements IVisual {
  private readonly target: HTMLElement;
  private readonly reactRoot: HTMLDivElement;
  private root: Root | null = null;
  private formattingManager: FormattingManager;

  constructor(options: VisualConstructorOptions) {
    this.target = options.element;

    this.reactRoot = document.createElement("div");
    this.reactRoot.className = "sparkline-container";
    this.target.appendChild(this.reactRoot);

    this.formattingManager = new FormattingManager();
  }

  public update(options: VisualUpdateOptions): void {
    console.log("Visual update", options);
    console.log("Update type:", options.type);

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

    // FormattingManager detecta automáticamente columnas y extrae configuraciones
    this.formattingManager.initializeSettings(options.dataViews[0], viewModel);

    console.log("=== Sparkline Settings Map ===");
    const sparklineSettings = this.formattingManager.getSparklineSettingsMap();
    sparklineSettings.forEach((settings, columnName) => {
      console.log(`${columnName}:`, settings);
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
      React.createElement(TableContainer, {
        viewModel,
        formattingSettings: this.formattingManager.getFormattingSettings(),
        sparklineSettings: this.formattingManager.getSparklineSettingsMap(),
        viewport,
      }),
    );
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingManager.getFormattingModel();
  }
}
