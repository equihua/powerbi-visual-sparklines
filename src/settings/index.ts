/**
 * Módulo de configuraciones de formato.
 * Exporta un único objeto que contiene todas las clases de configuración.
 */

import { GeneralSettings } from "./general";
import { TypographySettings } from "./typography";
import { InteractivitySettings } from "./interactivity";
import { GridSettings } from "./grid";
import { RowsSettings } from "./rows";
import { ColumnSettings } from "./columns";
import { TotalSettings } from "./totals";
import {
  SparklineCompositeCard,
  type SparklineColumnSettings,
} from "./sparkline";

export const Settings = {
  GeneralSettings,
  TypographySettings,
  InteractivitySettings,
  GridSettings,
  RowsSettings,
  ColumnSettings,
  TotalSettings,
  SparklineCompositeCard,
};

export type { SparklineColumnSettings };
