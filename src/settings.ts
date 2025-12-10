import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

class GeneralSettings extends formattingSettings.SimpleCard {
    textSize: formattingSettings.NumUpDown = new formattingSettings.NumUpDown({
        name: "textSize",
        displayName: "Tamaño de texto",
        value: 12
    });

    alternateRowColor: formattingSettings.ToggleSwitch = new formattingSettings.ToggleSwitch({
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

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    general: GeneralSettings = new GeneralSettings();

    cards: formattingSettings.SimpleCard[] = [this.general];

    private sparklineSettings: Map<string, SparklineColumnSettings> = new Map();

    public setSparklineSettings(columnKey: string, settings: SparklineColumnSettings): void {
        this.sparklineSettings.set(columnKey, settings);
    }

    public getSparklineSettings(columnKey: string): SparklineColumnSettings {
        return this.sparklineSettings.get(columnKey) || {
            chartType: "line",
            color: "#0078D4",
            lineWidth: 1.5
        };
    }

    public getAllSparklineSettings(): Map<string, SparklineColumnSettings> {
        return this.sparklineSettings;
    }
}
