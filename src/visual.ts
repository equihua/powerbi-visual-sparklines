/*
 *  Power BI Visual CLI - Sparklines Visual
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
import { getValue } from "powerbi-visuals-utils-dataviewutils/lib/dataViewObject";
import {
  createTooltipServiceWrapper,
  ITooltipServiceWrapper,
} from "powerbi-visuals-utils-tooltiputils";
import { valueFormatter as valueFormatterFactory } from "powerbi-visuals-utils-formattingutils";
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.visuals.ISelectionId;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;

import { VisualFormattingSettingsModel } from "./settings";

// Tipo para puntos de datos del sparkline
interface SparklinePoint {
  x: number;
  y: number;
  label: string;
  formattedValue?: string;
}

// Tipo para cada fila del sparkline
interface SparklineRow {
  name: string;
  points: SparklinePoint[];
  selectionId: ISelectionId;
}

// Interfaz para configuración de sparkline
interface SparklineConfig {
  lineColor: string;
  lineWidth: number;
  showPoints: boolean;
  pointRadius: number;
}

export class Visual implements IVisual {
  private container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  private formattingSettingsService: FormattingSettingsService;
  private formattingSettings: VisualFormattingSettingsModel;
  private selectionManager: ISelectionManager;
  private tooltipServiceWrapper: ITooltipServiceWrapper;
  private host: IVisualHost;
  private sparklineData: SparklineRow[] = [];
  private selectedRowId: ISelectionId | null = null;

  // Parámetros de configuración del sparkline
  private sparklineSettings: SparklineConfig = {
    lineColor: "#0078d4",
    lineWidth: 2,
    showPoints: false,
    pointRadius: 3,
  };

  // Dimensiones del SVG (se ajustarán dinámicamente con viewport)
  private sparklineWidth = 200;
  private sparklineHeight = 40;
  private readonly margin = { top: 5, right: 5, bottom: 5, left: 5 };
  private readonly maxColumnsBeforeReduction = 50;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);

    this.host = options.host;
    this.formattingSettingsService = new FormattingSettingsService();
    this.selectionManager = this.host.createSelectionManager();
    this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      options.element
    );

    // Crear contenedor principal
    this.container = d3
      .select(options.element)
      .append("div")
      .attr("class", "sparkline-container")
      .style("padding", "10px")
      .style("overflow-y", "auto")
      .style("max-height", "100%")
      .style("width", "100%");
  }

  public update(options: VisualUpdateOptions) {
    try {
      console.log("Visual Update Options:", options);

      // Obtener el dataView principal
      const dataView = options.dataViews && options.dataViews[0];
      this.container.html(""); // Limpiar contenedor

      if (!dataView || !dataView.matrix) {
        this.renderEmptyState("No data available");
        return;
      }

      // Ajustar dimensiones según viewport
      this.adjustDimensionsForViewport(options.viewport);

      // Obtener configuración de formato
      this.parseSparklineSettings(dataView);

      // Extraer datos de la matriz
      this.sparklineData = this.extractSparklineData(dataView);

      if (this.sparklineData.length === 0) {
        this.renderEmptyState("No rows to display");
        return;
      }

      // Renderizar los sparklines
      this.render();
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Ajusta las dimensiones del sparkline según el viewport
   */
  private adjustDimensionsForViewport(viewport: powerbi.IViewport): void {
    // Ajustar altura según disponible (menos espacio para labels)
    const availableHeight = Math.max(40, viewport.height / (this.sparklineData.length + 2));
    this.sparklineHeight = Math.min(availableHeight - 10, 80);

    // Ajustar ancho según disponible (menos espacio para labels)
    this.sparklineWidth = Math.max(100, viewport.width - 200);

    console.log(`Viewport adjusted: ${this.sparklineWidth}x${this.sparklineHeight}`);
  }

  /**
   * Parsea la configuración de sparklineSettings desde dataView.objects
   */
  private parseSparklineSettings(dataView: DataView): void {
    const objects = dataView.metadata.objects;

    if (objects) {
      const sparklineSettings = objects["sparklineSettings"];

      if (sparklineSettings) {
        // Obtener color de línea
        const lineColorFill = getValue<any>(sparklineSettings, "lineColor");
        if (lineColorFill && lineColorFill.solid) {
          this.sparklineSettings.lineColor = lineColorFill.solid.color;
        }

        // Obtener grosor de línea
        const lineWidth = getValue<number>(sparklineSettings, "lineWidth");
        if (lineWidth !== undefined) {
          this.sparklineSettings.lineWidth = Math.max(1, lineWidth);
        }

        // Obtener si mostrar puntos
        const showPoints = getValue<boolean>(sparklineSettings, "showPoints");
        if (showPoints !== undefined) {
          this.sparklineSettings.showPoints = showPoints;
        }
      }
    }

    // Valores por defecto si no se especifican
    if (!this.sparklineSettings.lineColor) {
      this.sparklineSettings.lineColor = "#0078d4";
    }
    if (!this.sparklineSettings.lineWidth) {
      this.sparklineSettings.lineWidth = 2;
    }

    console.log("Sparkline Settings:", this.sparklineSettings);
  }

  /**
   * Extrae datos de la matriz para los sparklines
   */
  private extractSparklineData(dataView: DataView): SparklineRow[] {
    const matrix = dataView.matrix;
    const rowChildren = matrix.rows?.root?.children || [];
    const columnChildren = matrix.columns?.root?.children || [];
    const valueSources = matrix.valueSources || [];

    if (rowChildren.length === 0 || columnChildren.length === 0) {
      return [];
    }

    // Aplicar data reduction si hay muchas columnas
    const columnsToShow = columnChildren.length > this.maxColumnsBeforeReduction
      ? columnChildren.slice(0, this.maxColumnsBeforeReduction)
      : columnChildren;

    console.log(`Data reduction: ${columnChildren.length} -> ${columnsToShow.length} columns`);

    // Usar la primera medida para el sparkline
    const valueSourceIndex = 0;
    const valueFormatter = valueFormatterFactory.create({
      format: valueSources[valueSourceIndex]?.format || "0.00",
    });

    const rows: SparklineRow[] = rowChildren.map(
      (row: any, rowIndex: number) => {
        // Obtener nombre de la fila
        const rowName =
          row.levelValues && row.levelValues[0]?.value
            ? row.levelValues[0].value
            : row.value;

        // Extraer puntos de datos para cada columna
        const points: SparklinePoint[] = columnsToShow.map(
          (col: any, colIndex: number) => {
            // La estructura de valores es: row.values[valueSourceIndex]?.value
            const cellValue =
              row.values && row.values[valueSourceIndex?.toString()]?.value;

            return {
              x: colIndex,
              y: typeof cellValue === "number" ? cellValue : 0,
              label: col.value || `Col ${colIndex}`,
              formattedValue: valueFormatter.format(cellValue),
            };
          }
        );

        // Crear selectionId para esta fila
        const selectionId = this.host
          .createSelectionIdBuilder()
          .withMatrixNode(row, matrix.rows.levels)
          .createSelectionId();

        return {
          name: String(rowName),
          points: points,
          selectionId: selectionId,
        };
      }
    );

    return rows;
  }

  /**
   * Renderiza todos los sparklines
   */
  private render(): void {
    // Crear un div para cada fila con su sparkline
    this.sparklineData.forEach((rowData) => {
      this.renderSparklineRow(rowData);
    });
  }

  /**
   * Renderiza una fila individual de sparkline
   */
  private renderSparklineRow(rowData: SparklineRow): void {
    const rowDiv = this.container
      .append("div")
      .attr("class", "sparkline-row")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "8px")
      .style("padding", "6px")
      .style("background-color", "#f9f9f9")
      .style("border-radius", "4px")
      .style("border", "1px solid #e0e0e0")
      .style("cursor", "pointer")
      .style("transition", "background-color 0.2s, border-color 0.2s")
      .on("click", () => this.handleRowClick(rowData))
      .on("mouseover", () => {
        rowDiv.style("background-color", "#f0f0f0");
      })
      .on("mouseout", () => {
        const isSelected = this.selectedRowId === rowData.selectionId;
        rowDiv.style("background-color", isSelected ? "#e8f4f8" : "#f9f9f9");
      });

    // Etiqueta del nombre de la fila
    rowDiv
      .append("div")
      .style("min-width", "150px")
      .style("max-width", "150px")
      .style("margin-right", "10px")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("overflow", "hidden")
      .style("text-overflow", "ellipsis")
      .style("white-space", "nowrap")
      .attr("title", rowData.name)
      .text(rowData.name);

    // SVG del sparkline
    const svgDiv = rowDiv
      .append("div")
      .style("flex", "1")
      .style("min-width", "0");

    this.renderSparklineSVG(svgDiv, rowData);
  }

  /**
   * Renderiza el SVG del sparkline para una fila
   */
  private renderSparklineSVG(
    container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
    rowData: SparklineRow
  ): void {
    const { points } = rowData;

    // Validar que haya puntos
    if (points.length === 0) {
      return;
    }

    // Filtrar valores válidos (no nulos)
    const validPoints = points.filter((p) => p.y !== null && !isNaN(p.y));

    if (validPoints.length === 0) {
      return;
    }

    // Calcular min/max para la escala Y
    const minY = Math.min(...validPoints.map((p) => p.y));
    const maxY = Math.max(...validPoints.map((p) => p.y));
    const yRange = maxY - minY || 1;

    // Crear escalas
    const xScale = d3
      .scaleLinear()
      .domain([0, points.length - 1])
      .range([this.margin.left, this.sparklineWidth - this.margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([minY - yRange * 0.1, maxY + yRange * 0.1])
      .range([this.sparklineHeight - this.margin.bottom, this.margin.top]);

    // Crear la función de línea con curva suave
    const line = d3
      .line<SparklinePoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Crear SVG
    const svg = container
      .append("svg")
      .attr("width", this.sparklineWidth)
      .attr("height", this.sparklineHeight)
      .style("background-color", "#ffffff")
      .style("border-radius", "3px")
      .style("border", "1px solid #e0e0e0");

    // Crear grupo para poder aplicar estilos
    const pathElement = svg
      .append("path")
      .datum(points)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", this.sparklineSettings.lineColor)
      .attr("stroke-width", this.sparklineSettings.lineWidth)
      .attr("class", "sparkline-path")
      .style("cursor", "pointer")
      .style("transition", "opacity 0.2s");

    // Dibujar puntos si está habilitado
    if (this.sparklineSettings.showPoints) {
      svg
        .selectAll(".sparkline-point")
        .data(validPoints)
        .enter()
        .append("circle")
        .attr("class", "sparkline-point")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", this.sparklineSettings.pointRadius)
        .attr("fill", this.sparklineSettings.lineColor)
        .style("cursor", "pointer")
        .style("transition", "opacity 0.2s")
        .on("mouseover", (event, d) => this.showTooltipWithWrapper(event, d, rowData))
        .on("mouseout", () => this.hideTooltip());
    }

    // Agregar listener para tooltip en la línea también
    pathElement
      .on("mouseover", (event) => {
        const [x, y] = d3.pointer(event);
        const closestPoint = this.getClosestPoint(validPoints, x, xScale, yScale);
        if (closestPoint) {
          this.showTooltipWithWrapper(event, closestPoint, rowData);
        }
      })
      .on("mouseout", () => this.hideTooltip());
  }

  /**
   * Encuentra el punto más cercano al cursor
   */
  private getClosestPoint(
    points: SparklinePoint[],
    xPos: number,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ): SparklinePoint | null {
    if (points.length === 0) return null;

    let closestPoint = points[0];
    let minDistance = Math.abs(xScale(closestPoint.x) - xPos);

    for (let i = 1; i < points.length; i++) {
      const distance = Math.abs(xScale(points[i].x) - xPos);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = points[i];
      }
    }

    return closestPoint;
  }

  /**
   * Muestra un tooltip usando TooltipServiceWrapper
   */
  private showTooltipWithWrapper(
    event: MouseEvent | any,
    point: SparklinePoint,
    rowData: SparklineRow
  ): void {
    const tooltipDataArray = [
      {
        displayName: "Row",
        value: rowData.name,
      },
      {
        displayName: "Column",
        value: point.label,
      },
      {
        displayName: "Value",
        value: point.formattedValue || point.y.toFixed(2),
      },
    ];

    this.tooltipServiceWrapper.addTooltip(
      d3.select(event.target),
      () => tooltipDataArray,
      undefined,
      true
    );
  }

  /**
   * Maneja el evento de clic en una fila de sparkline
   */
  private handleRowClick(rowData: SparklineRow): void {
    // Actualizar estado de selección
    this.selectedRowId = this.selectedRowId === rowData.selectionId ? null : rowData.selectionId;
    
    // Aplicar selección en Power BI
    this.selectionManager.select(rowData.selectionId, true);
  }

  /**
   * Limpia la selección actual
   */
  private clearSelection(): void {
    this.selectedRowId = null;
    this.selectionManager.clear();
  }

  /**
   * Oculta el tooltip
   */
  private hideTooltip(): void {
    // TooltipServiceWrapper maneja la limpieza automáticamente
  }

  /**
   * Renderiza un estado vacío
   */
  private renderEmptyState(message: string): void {
    this.container.html(
      `<div style='padding: 20px; color: #666; text-align: center;'>${message}</div>`
    );
  }

  /**
   * Renderiza un error
   */
  private renderError(error: any): void {
    console.error("Error in update method:", error);
    this.container.html(`
      <div style='padding: 20px; color: red;'>
        <h3>Error</h3>
        <p>${error.message || "Unknown error"}</p>
      </div>
    `);
  }

  /**
   * Obtiene el modelo de formato de Power BI
   */
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}
