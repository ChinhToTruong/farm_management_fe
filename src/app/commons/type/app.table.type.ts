export interface Column {
    header: string;
    field: string;
    type: 'date' | 'text' | 'select';
    operator: 'like' | 'equal';
    width: string;
    minWidth: string;
    customExportHeader?: string;
    sortable: boolean;
}

export interface ExportColumn {
    title: string;
    dataKey: string;
}
