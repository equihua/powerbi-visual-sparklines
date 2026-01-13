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
  type TypographyStyle,
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
  private columnSettings: Map<string, ColumnConfigSettings> = new Map();
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  // Caches para detectar cambios en configuraciones
  private previousSparklineHash: string = "";
  private previousColumnHash: string = "";
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

    // PASO 1: Actualizar modelo de configuración desde dataView
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );

    console.log("=== Formatting Settings ===", this.formattingSettings);
    console.log(
      "Búsqueda habilitada:",
      this.formattingSettings.general.featuresGroup.searchable.value
    );
    console.log(
      "Ordenamiento habilitado:",
      this.formattingSettings.general.featuresGroup.sortable.value
    );
    console.log(
      "Selección de fila:",
      this.formattingSettings.general.selectionGroup.rowSelection.value
    );

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
    this.formattingSettings.updateTypographyTargetColumns(measureColumnNames);

    // Calcular hash de configuraciones para detectar cambios reales
    const newSparklineHash = generateHash({
      columns: sparklineColumnNames.sort(),
      settings: sparklineColumnNames.map((col) =>
        this.formattingSettings.getSparklineSettings(col)
      ),
    });

    const newColumnHash = generateHash({
      columns: measureColumnNames.sort(),
      settings: measureColumnNames.map((col) =>
        this.formattingSettings.getColumnSettings(col)
      ),
    });

    // Solo actualizar sparklineSettings si realmente cambió
    if (newSparklineHash !== this.previousSparklineHash) {
      this.sparklineSettings.clear();
      sparklineColumnNames.forEach((columnName) => {
        const settings =
          this.formattingSettings.getSparklineSettings(columnName);
        this.sparklineSettings.set(columnName, settings);
      });
      this.previousSparklineHash = newSparklineHash;
    }

    // Solo actualizar columnSettings si realmente cambió
    if (newColumnHash !== this.previousColumnHash) {
      this.columnSettings.clear();
      measureColumnNames.forEach((columnName) => {
        const settings = this.formattingSettings.getColumnSettings(columnName);
        this.columnSettings.set(columnName, settings);
      });
      this.previousColumnHash = newColumnHash;
    }

    this.renderTable(viewModel, options.viewport);
  }

  private clearContainer(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  /**
   * Renderiza la tabla con estilos tipográficos aplicados.
   * Los estilos se pasan como props a TableContainer para reactividad.
   * @param viewModel Datos de la tabla
   * @param viewport Dimensiones del viewport
   */
  private renderTable(viewModel: TableViewModel, viewport: IViewport): void {
    if (!this.root) {
      this.root = createRoot(this.reactRoot);
    }

    // Obtener estilos tipográficos para aplicar reactivamente
    const typographyStyle = this.getTypographyStyle();

    // Renderizado simplificado: pasar datos, configuración y estilos al contenedor
    this.root.render(
      React.createElement(TableContainer, {
        viewModel,
        formattingSettings: this.formattingSettings,
        sparklineSettings: this.sparklineSettings,
        columnSettings: this.columnSettings,
        typographyStyle, // ← NUEVO: Pasar estilos para aplicar reactivamente
        viewport,
      })
    );
  }

  /**
   * Obtiene estilos de tipografía desde las configuraciones de formato.
   * Este es el único punto de acceso para leer estilos tipográficos.
   *
   * @returns Objeto con propiedades CSS de tipografía
   */
  public getTypographyStyle(): TypographyStyle {
    const typography: any = this.formattingSettings.typography;
    const font = typography?.font || typography;

    const applyTo = (typography?.applyTo?.value as "all" | "column") || "all";
    const targetColumn = typography?.targetColumn?.value || "";

    const fontFamily =
      font?.fontFamily?.value ||
      typography?.fontFamily?.value ||
      "Segoe UI, sans-serif";
    const fontSize = font?.fontSize?.value || typography?.fontSize?.value || 11;
    const fontColor =
      typography?.fontColor?.value?.value ||
      typography?.fontColor?.value ||
      "#000000";
    const bold = font?.bold?.value || typography?.bold?.value || false;
    const italic = font?.italic?.value || typography?.italic?.value || false;
    const underline =
      font?.underline?.value || typography?.underline?.value || false;
    const lineHeight = typography?.lineHeight?.value || 1.4;
    const letterSpacing = typography?.letterSpacing?.value || 0;
    const alignment = typography?.alignment?.value || "left";

    return {
      fontFamily,
      fontSize,
      fontColor,
      fontWeight: bold ? "bold" : "normal",
      fontStyle: italic ? "italic" : "normal",
      textDecoration: underline ? "underline" : "none",
      lineHeight,
      letterSpacing,
      alignment,
      applyTo,
      targetColumn,
    };
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
