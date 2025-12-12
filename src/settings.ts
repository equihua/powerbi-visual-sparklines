import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

class GeneralSettings extends formattingSettings.SimpleCard {
    textSize = new formattingSettings.NumUpDown({
        name: "textSize",
        displayName: "Tamaño de texto",
        value: 12
    });

    alternateRowColor = new formattingSettings.ToggleSwitch({
        name: "alternateRowColor",
        displayName: "Color de filas alternas",
        value: true
    });

    name: string = "general";
    displayName: string = "General";
    slices: formattingSettings.Slice[] = [this.textSize, this.alternateRowColor];
}

export interface SparklineColumnSettings {
    chartType: string;
    color: string;
    lineWidth: number;
}

export class SparklineCompositeCard extends formattingSettings.CompositeCard {
    name: string = "sparklineColumn";
    displayName: string = "Minigráficos";
    groups: formattingSettings.Group[] = [];
    private columnMap: Map<string, { chartType: formattingSettings.ItemDropdown, color: formattingSettings.ColorPicker, lineWidth: formattingSettings.NumUpDown }> = new Map();

    constructor(columns: powerbi.DataViewMetadataColumn[]) {
        super();
        this.groups = columns.map((column, index) => {
            const displayName = column.displayName || `Columna ${index + 1}`;
            const columnKey = column.queryName || column.displayName || `column${index}`;
            const selector: powerbi.data.Selector = { metadata: column.queryName };

            const chartType = new formattingSettings.ItemDropdown({
                name: "chartType",
                displayName: "Tipo de gráfico",
                items: [
                    { value: "line", displayName: "Línea" },
                    { value: "bar", displayName: "Barras" },
                    { value: "area", displayName: "Área" },
                    { value: "pie", displayName: "Circular" },
                    { value: "donut", displayName: "Anillo" }
                ],
                value: { value: "line", displayName: "Línea" },
                selector: selector
            });

            const color = new formattingSettings.ColorPicker({
                name: "color",
                displayName: "Color",
                value: { value: "#0078D4" },
                selector: selector
            });

            const lineWidth = new formattingSettings.NumUpDown({
                name: "lineWidth",
                displayName: "Grosor de línea",
                value: 1.5,
                options: {
                    minValue: { value: 0.5, type: powerbi.visuals.ValidatorType.Min },
                    maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
                },
                selector: selector
            });

            this.columnMap.set(columnKey, { chartType, color, lineWidth });

            return new formattingSettings.Group({
                name: `group_${columnKey.replace(/[^a-zA-Z0-9]/g, "_")}`,
                displayName: displayName,
                slices: [chartType, color, lineWidth]
            });
        });
    }

    public setColumnSettings(columnKey: string, settings: SparklineColumnSettings): void {
        const controls = this.columnMap.get(columnKey);
        if (controls) {
            const chartTypeItem = controls.chartType.items.find(item => item.value === settings.chartType);
            if (chartTypeItem) {
                controls.chartType.value = chartTypeItem;
            }
            controls.color.value = { value: settings.color };
            controls.lineWidth.value = settings.lineWidth;
        }
    }
}

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    general: GeneralSettings = new GeneralSettings();
    sparklineCard: SparklineCompositeCard | null = null;

    cards: formattingSettings.SimpleCard[] = [this.general];

    public updateSparklineCards(columns: powerbi.DataViewMetadataColumn[]): void {
        if (columns.length > 0) {
            this.sparklineCard = new SparklineCompositeCard(columns);
            this.cards = [this.general, this.sparklineCard as any];
        } else {
            this.sparklineCard = null;
            this.cards = [this.general];
        }
    }

    public setSparklineSettings(columnKey: string, settings: SparklineColumnSettings): void {
        this.sparklineCard?.setColumnSettings(columnKey, settings);
    }
}