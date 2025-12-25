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

import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;

import { VisualFormattingSettingsModel } from "./settings";

type Point = { x: any; y: number | null };

export class Visual implements IVisual {
  private container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  private formattingSettingsService: FormattingSettingsService;
  private formattingSettings: VisualFormattingSettingsModel;
  private data: any; // processed model stored here
  private dataViewInfo: any; // información completa del dataView

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);

    this.formattingSettingsService = new FormattingSettingsService();
    this.container = d3
      .select(options.element)
      .append("div")
      .attr("class", "sparkline-table");
  }

  public update(options: VisualUpdateOptions) {
    try {
      console.log("Visual Update Options:", options);
      const dataView = options.dataViews && options.dataViews[0];
      this.container.html("");

      if (!dataView || !dataView.matrix) {
        this.renderEmptyState("No data available");
        return;
      }

      this.formattingSettings =
        this.formattingSettingsService.populateFormattingSettingsModel(
          VisualFormattingSettingsModel,
          dataView
        );

      // Extraer columnas (medidas)
      const valueSources = dataView.matrix.valueSources || [];
      const columns = valueSources.map((vs) => ({
        displayName: vs.displayName,
        format: vs.format,
      }));

      // Extraer filas (objetivos)
      const rowChildren = dataView.matrix.rows?.root?.children || [];

      // Renderizar tabla
      const table = this.container
        .append("table")
        .attr("class", "sparkline-table");
      const thead = table.append("thead");
      const tbody = table.append("tbody");

      // Encabezados
      const headerRow = thead.append("tr");
      headerRow.append("th").text("Objetivo");
      columns.forEach((col) => {
        headerRow.append("th").text(col.displayName);
      });

      // Filas de datos
      rowChildren.forEach((row) => {
        const tr = tbody.append("tr");
        // Nombre del objetivo
        const objetivo =
          row.levelValues && row.levelValues[0]?.value
            ? row.levelValues[0].value
            : row.value;
        tr.append("td").text(String(objetivo));
        // Valores de medidas
        columns.forEach((col, idx) => {
          const valObj = row.values && row.values[idx?.toString()];
          let value = valObj && valObj.value != null ? valObj.value : "";
          // Formatear porcentaje si aplica
          if (
            col.format &&
            col.format.includes("%") &&
            typeof value === "number"
          ) {
            value = (value * 100).toFixed(1) + "%";
          }
          tr.append("td").text(value);
        });
      });

      // Resumen de datos
      this.data = {
        rows: rowChildren,
        summary: {
          rowCount: rowChildren.length,
          ColumnsCount: columns.length,
          valueMeasureCount: columns.length,
        },
      };

      // Guardar información completa del dataView
      this.dataViewInfo = {
        viewport: {
          width: options.viewport.width,
          height: options.viewport.height,
        },
        updateType: options.type,
        operationKind: options.operationKind,
        metadata: {
          columns: dataView.metadata.columns.map((col) => ({
            displayName: col.displayName,
            queryName: col.queryName,
            roles: col.roles,
            type: {
              text: col.type.text,
              numeric: col.type.numeric,
              integer: col.type.integer,
              bool: col.type.bool,
            },
            format: col.format,
            isMeasure: col.isMeasure || false,
          })),
          isDataFilterApplied: dataView.metadata.isDataFilterApplied,
        },
        matrix: {
          rowLevels: dataView.matrix.rows?.levels?.length || 0,
          columnLevels: dataView.matrix.columns?.levels?.length || 0,
          rowCount: rowChildren.length,
          valueSourcesCount: valueSources.length,
          rowHierarchy: this.extractRowHierarchy(dataView.matrix.rows),
          columnHierarchy: this.extractColumnHierarchy(dataView.matrix.columns),
          valueSources: valueSources.map((vs) => ({
            displayName: vs.displayName,
            queryName: vs.queryName,
            format: vs.format,
            isMeasure: vs.isMeasure,
          })),
        },
      };

      this.render();
    } catch (error) {
      this.renderError(error);
    }
  }

  private render(): void {
    this.container.html("");

    if (!this.data || !this.data.rows.length) {
      this.renderEmptyState("No rows to display");
      return;
    }

    const summaryDiv = this.container
      .append("div")
      .style("padding", "20px")
      .style("font-family", "monospace")
      .style("background-color", "#f5f5f5")
      .style("border-radius", "8px")
      .style("margin-bottom", "20px")
      .style("max-height", "90vh")
      .style("overflow-y", "auto")
      .style("overflow-x", "hidden");

    // Título principal
    summaryDiv
      .append("h2")
      .style("color", "#333")
      .style("border-bottom", "2px solid #0078d4")
      .style("padding-bottom", "10px")
      .text("📊 Resumen Completo del DataView");

    // Viewport
    summaryDiv
      .append("h3")
      .style("color", "#0078d4")
      .style("margin-top", "20px")
      .text("🖥️ Viewport");

    summaryDiv
      .append("ul")
      .style("list-style", "none")
      .style("padding-left", "20px").html(`
        <li>📐 <strong>Ancho:</strong> ${this.dataViewInfo.viewport.width.toFixed(
          2
        )} px</li>
        <li>📏 <strong>Alto:</strong> ${this.dataViewInfo.viewport.height.toFixed(
          2
        )} px</li>
      `);

    // Información de actualización
    summaryDiv
      .append("h3")
      .style("color", "#0078d4")
      .style("margin-top", "20px")
      .text("🔄 Información de Actualización");

    summaryDiv
      .append("ul")
      .style("list-style", "none")
      .style("padding-left", "20px").html(`
        <li>⚡ <strong>Tipo de Actualización:</strong> ${this.dataViewInfo.updateType}</li>
        <li>🔧 <strong>Tipo de Operación:</strong> ${this.dataViewInfo.operationKind}</li>
      `);

    // Metadata
    summaryDiv
      .append("h3")
      .style("color", "#0078d4")
      .style("margin-top", "20px")
      .text("📋 Metadata");

    summaryDiv
      .append("ul")
      .style("list-style", "none")
      .style("padding-left", "20px").html(`
        <li>📊 <strong>Total de Columnas:</strong> ${
          this.dataViewInfo.metadata.columns.length
        }</li>
        <li>🔍 <strong>Filtro de Datos Aplicado:</strong> ${
          this.dataViewInfo.metadata.isDataFilterApplied ? "Sí" : "No"
        }</li>
      `);

    // Detalle de columnas
    summaryDiv
      .append("h4")
      .style("color", "#106ebe")
      .style("margin-top", "15px")
      .style("margin-left", "20px")
      .text("📌 Columnas Configuradas:");

    const columnsTable = summaryDiv
      .append("table")
      .style("margin-left", "40px")
      .style("border-collapse", "collapse")
      .style("margin-top", "10px")
      .style("background", "white")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    const colThead = columnsTable.append("thead");
    const colTbody = columnsTable.append("tbody");

    colThead
      .append("tr")
      .style("background-color", "#0078d4")
      .style("color", "white").html(`
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Nombre</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Query Name</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Roles</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Tipo</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Formato</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Es Medida</th>
      `);

    this.dataViewInfo.metadata.columns.forEach((col: any) => {
      const roles = Object.keys(col.roles || {}).join(", ");
      const tipo = [];
      if (col.type.text) tipo.push("Texto");
      if (col.type.numeric) tipo.push("Numérico");
      if (col.type.integer) tipo.push("Entero");
      if (col.type.bool) tipo.push("Booleano");

      colTbody.append("tr").style("border-bottom", "1px solid #ddd").html(`
          <td style="padding: 8px; border: 1px solid #ddd;">${
            col.displayName
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${
            col.queryName
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${roles}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            tipo.join(", ") || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            col.format || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
            col.isMeasure ? "✅" : "❌"
          }</td>
        `);
    });

    // Estructura de Matriz
    summaryDiv
      .append("h3")
      .style("color", "#0078d4")
      .style("margin-top", "20px")
      .text("🎯 Estructura de Matriz");

    summaryDiv
      .append("ul")
      .style("list-style", "none")
      .style("padding-left", "20px").html(`
        <li>📊 <strong>Niveles de Filas:</strong> ${this.dataViewInfo.matrix.rowLevels}</li>
        <li>📊 <strong>Niveles de Columnas:</strong> ${this.dataViewInfo.matrix.columnLevels}</li>
        <li>📈 <strong>Total de Filas:</strong> ${this.dataViewInfo.matrix.rowCount}</li>
        <li>📉 <strong>Fuentes de Valores (Medidas):</strong> ${this.dataViewInfo.matrix.valueSourcesCount}</li>
      `);

    // Jerarquía de Filas
    if (this.dataViewInfo.matrix.rowHierarchy) {
      summaryDiv
        .append("h4")
        .style("color", "#106ebe")
        .style("margin-top", "15px")
        .style("margin-left", "20px")
        .text("📂 Jerarquía de Filas:");

      summaryDiv
        .append("pre")
        .style("margin-left", "40px")
        .style("background", "white")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("overflow-x", "auto")
        .style("font-size", "12px")
        .text(JSON.stringify(this.dataViewInfo.matrix.rowHierarchy, null, 2));
    }

    // Jerarquía de Columnas
    if (this.dataViewInfo.matrix.columnHierarchy) {
      summaryDiv
        .append("h4")
        .style("color", "#106ebe")
        .style("margin-top", "15px")
        .style("margin-left", "20px")
        .text("📂 Jerarquía de Columnas:");

      summaryDiv
        .append("pre")
        .style("margin-left", "40px")
        .style("background", "white")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("overflow-x", "auto")
        .style("font-size", "12px")
        .text(
          JSON.stringify(this.dataViewInfo.matrix.columnHierarchy, null, 2)
        );
    }

    // Value Sources
    summaryDiv
      .append("h4")
      .style("color", "#106ebe")
      .style("margin-top", "15px")
      .style("margin-left", "20px")
      .text("📊 Fuentes de Valores (Medidas):");

    const measuresTable = summaryDiv
      .append("table")
      .style("margin-left", "40px")
      .style("border-collapse", "collapse")
      .style("margin-top", "10px")
      .style("background", "white")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

    const measuresThead = measuresTable.append("thead");
    const measuresTbody = measuresTable.append("tbody");

    measuresThead
      .append("tr")
      .style("background-color", "#0078d4")
      .style("color", "white").html(`
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Nombre</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Query Name</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Formato</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Es Medida</th>
      `);

    this.dataViewInfo.matrix.valueSources.forEach((vs: any) => {
      measuresTbody.append("tr").style("border-bottom", "1px solid #ddd").html(`
          <td style="padding: 8px; border: 1px solid #ddd;">${
            vs.displayName
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 11px;">${
            vs.queryName
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            vs.format || "N/A"
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
            vs.isMeasure ? "✅" : "❌"
          }</td>
        `);
    });

    // Resumen de Datos
    summaryDiv
      .append("h3")
      .style("color", "#0078d4")
      .style("margin-top", "20px")
      .text("📊 Resumen de Datos");

    summaryDiv
      .append("ul")
      .style("list-style", "none")
      .style("padding-left", "20px").html(`
        <li>📋 <strong>Filas de Datos:</strong> ${this.data.summary.rowCount}</li>
        <li>📊 <strong>Columnas de Datos:</strong> ${this.data.summary.ColumnsCount}</li>
        <li>📈 <strong>Medidas de Valor:</strong> ${this.data.summary.valueMeasureCount}</li>
      `);
  }

  private extractRowHierarchy(rows: any): any {
    if (!rows || !rows.root) return null;

    return {
      levels:
        rows.levels?.map((level: any) => ({
          sources: level.sources?.map((source: any) => ({
            displayName: source.displayName,
            queryName: source.queryName,
            roles: source.roles,
          })),
        })) || [],
      childrenCount: rows.root.children?.length || 0,
      children:
        rows.root.children?.map((child: any) => ({
          level: child.level,
          value: child.value,
          hasValues: !!child.values,
          valueCount: child.values ? Object.keys(child.values).length : 0,
        })) || [],
    };
  }

  private extractColumnHierarchy(columns: any): any {
    if (!columns || !columns.root) return null;

    return {
      levels:
        columns.levels?.map((level: any) => ({
          sources: level.sources?.map((source: any) => ({
            displayName: source.displayName,
            queryName: source.queryName,
            roles: source.roles,
          })),
        })) || [],
      childrenCount: columns.root.children?.length || 0,
      children:
        columns.root.children?.map((child: any) => ({
          level: child.level,
          value: child.value,
          hasChildren: !!child.children,
          childrenCount: child.children?.length || 0,
        })) || [],
    };
  }

  private renderEmptyState(message: string): void {
    this.container.html(
      `<div style='padding: 20px; color: #666;'>${message}</div>`
    );
  }

  private renderError(error: any): void {
    console.error("Error in update method:", error);
    this.container.html(`
      <div style='padding: 20px; color: red;'>
        <h3>Error</h3>
        <p>${error.message}</p>
      </div>
    `);
  }

  // Panel de formato de Power BI
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
