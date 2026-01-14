import React from "react";
import { Table } from "./Table";
import { TableViewModel } from "../visualViewModel";
import {
  VisualFormattingSettingsModel,
  type SparklineColumnSettings,
} from "../settings";
import powerbi from "powerbi-visuals-api";
import IViewport = powerbi.IViewport;

export interface TableContainerProps {
  viewModel: TableViewModel;
  formattingSettings: VisualFormattingSettingsModel;
  sparklineSettings: Map<string, SparklineColumnSettings>;
  viewport: IViewport;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  viewModel,
  formattingSettings,
  sparklineSettings,
  viewport,
}) => {
  const tableProps = {
    viewModel,
    width: viewport.width,
    
    columnHeadersSettings: formattingSettings.columnHeaders,
    valuesSettings: formattingSettings.values,
    totalsSettings: formattingSettings.totals,
    gridSettings: formattingSettings.grid,
    
    rowSelection: formattingSettings.general.selectionGroup.rowSelection.value,
    rowSelectionColor: formattingSettings.general.selectionGroup.rowSelectionColor.value.value,
    sortable: formattingSettings.general.featuresGroup.sortable.value,
    searchable: formattingSettings.general.featuresGroup.searchable.value,
    pagination: formattingSettings.general.navigationGroup.pagination.value,
    rowsPerPage: formattingSettings.general.navigationGroup.rowsPerPage.value,
    
    sparklineSettings,
  };

  return <Table {...tableProps} />;
};
