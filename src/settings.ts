import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

class GeneralSettings extends formattingSettings.SimpleCard {
    textSize = new formattingSettings.NumUpDown({
        name: "textSize",
        displayName: "Tamaño de texto",
        value: 12,
        options: {
            minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 40, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    alternateRowColor = new formattingSettings.ToggleSwitch({
        name: "alternateRowColor",
        displayName: "Color de filas alternadas",
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

class SparklineColumnGroup extends formattingSettings.Group {
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
        value: 1.5,
        options: {
            minValue: { value: 0.5, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    constructor(name: string, displayName: string) {
        super({
            name: name,
            displayName: displayName,
            slices: []
        });
        this.slices = [this.chartType, this.color, this.lineWidth];
    }
}

export class SparklineCompositeCard extends formattingSettings.CompositeCard {
    name: string = "sparklineColumn";
    displayName: string = "Minigráficos";
    groups: SparklineColumnGroup[] = [];
    private columnKeyMap: Map<string, SparklineColumnGroup> = new Map();

    constructor(sparklineColumnNames: string[]) {
        super();
        this.groups = sparklineColumnNames.map((columnName) => {
            const groupName = `sparkline_${columnName.replace(/[^a-zA-Z0-9]/g, "_")}`;
            const group = new SparklineColumnGroup(groupName, columnName);

            this.columnKeyMap.set(columnName, group);
            return group;
        });
    }

    public getSettings(columnName: string): SparklineColumnSettings {
        const group = this.columnKeyMap.get(columnName);
        if (group) {
            return {
                chartType: group.chartType.value.value as string,
                color: group.color.value.value,
                lineWidth: group.lineWidth.value
            };
        }
        return {
            chartType: "line",
            color: "#0078D4",
            lineWidth: 1.5
        };
    }

    public setSettings(columnName: string, settings: SparklineColumnSettings): void {
        const group = this.columnKeyMap.get(columnName);
        if (group) {
            const chartTypeItem = group.chartType.items.find(item => item.value === settings.chartType);
            if (chartTypeItem) {
                group.chartType.value = chartTypeItem;
            }
            group.color.value = { value: settings.color };
            group.lineWidth.value = settings.lineWidth;
        }
    }
}

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    general: GeneralSettings = new GeneralSettings();
    sparklineCard: SparklineCompositeCard | null = null;

    cards: (formattingSettings.SimpleCard | formattingSettings.CompositeCard)[] = [this.general];

    public updateSparklineCards(sparklineColumnNames: string[]): void {
        if (sparklineColumnNames && sparklineColumnNames.length > 0) {
            this.sparklineCard = new SparklineCompositeCard(sparklineColumnNames);
            this.cards = [this.general, this.sparklineCard];
        } else {
            this.sparklineCard = null;
            this.cards = [this.general];
        }
    }

    public getSparklineSettings(columnName: string): SparklineColumnSettings {
        if (this.sparklineCard) {
            return this.sparklineCard.getSettings(columnName);
        }
        return {
            chartType: "line",
            color: "#0078D4",
            lineWidth: 1.5
        };
    }

    public setSparklineSettings(columnName: string, settings: SparklineColumnSettings): void {
        this.sparklineCard?.setSettings(columnName, settings);
    }
}