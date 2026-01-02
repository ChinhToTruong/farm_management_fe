import { Column } from '@/commons/type/app.table.type';

export const col: Column[] = [
    {
        field: 'cropSeasonName',
        type: 'text',
        operator: 'like',
        header: 'Vụ mùa',
        sortable: true
    },
    {
        field: 'locationName',
        type: 'text',
        operator: 'like',
        header: 'Khu vực',
        sortable: true
    },
    {
        field: 'plantName',
        type: 'text',
        operator: 'equal',     // enum → nên dùng equal
        header: 'Loại vật nuôi',
        sortable: true
    },
    {
        field: 'plantVariety',
        type: 'text',
        operator: 'equal',     // enum → equal
        header: 'Giống vật nuôi',
        sortable: true
    },
    {
        field: 'quantity',
        type: 'text',
        operator: 'equal',
        header: 'Số lượng',
        sortable: true
    },
    {
        field: 'sowDate',
        type: 'date',
        operator: 'like',   // ngày → nên between
        header: 'Ngày gieo trồng',
        sortable: true
    },
    {
        field: 'harvestDate',
        type: 'date',
        operator: 'like',
        header: 'Ngày thu hoạch',
        sortable: true
    },
    {
        field: 'statusName',
        type: 'text',
        operator: 'equal',     // enum
        header: 'Trạng thái',
        sortable: true
    },
    {
        field: 'notes',
        type: 'text',
        operator: 'like',
        header: 'Ghi chú',
        sortable: false
    }
];
