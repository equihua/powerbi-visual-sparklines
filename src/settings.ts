/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

export class GeneralSettings extends formattingSettings.SimpleCard {
    textSize = new formattingSettings.NumUpDown({
        name: "textSize",
        displayName: "Tamaño de texto",
        value: 12
    });

    alternateRowColor = new formattingSettings.ColorPicker({
        name: "alternateRowColor",
        displayName: "Color de filas alternadas",
        value: { value: "#faf9f8" }
    });

    name: string = "general";
    displayName: string = "General";
    slices = [this.textSize, this.alternateRowColor];
}

export class SparklineColumnSettings extends formattingSettings.SimpleCard {
    chartType = new formattingSettings.ItemDropdown({
        name: "chartType",
        displayName: "Tipo de gráfico",
        items: [
            { value: "line", displayName: "Línea" },
            { value: "bar", displayName: "Barras" },
            { value: "area", displayName: "Área" },
            { value: "pie", displayName: "Circular" },
            { value: "donut", displayName: "Anillo" }
        ],
        value: { value: "line", displayName: "Línea" }
    });

    color = new formattingSettings.ColorPicker({
        name: "color",
        displayName: "Color",
        value: { value: "#0078D4" }
    });

    lineWidth = new formattingSettings.NumUpDown({
        name: "lineWidth",
        displayName: "Grosor de línea",
        value: 1.5
    });

    name: string;
    displayName: string;
    slices = [this.chartType, this.color, this.lineWidth];

    constructor(columnName: string, displayName: string) {
        super();
        this.name = columnName;
        this.displayName = displayName;
    }
}

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    general = new GeneralSettings();
    sparklineCards: SparklineColumnSettings[] = [];

    cards: formattingSettings.SimpleCard[] = [this.general];

    populateSparklineCards(columns: powerbi.DataViewMetadataColumn[]): void {
        this.sparklineCards = columns.map(col =>
            new SparklineColumnSettings(
                `sparkline_${col.queryName || col.displayName}`,
                col.displayName
            )
        );
        this.cards = [this.general, ...this.sparklineCards];
    }
}
