import { Column } from '@/commons/type/app.table.type';

export const col: Column[] = [
    {
        field: 'seasonName',
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
        field: 'batchName',
        type: 'text',
        operator: 'equal',     // enum → nên dùng equal
        header: 'Tên đàn vật nuôi',
        sortable: true
    },
    {
        field: 'animalType',
        type: 'text',
        operator: 'equal',     // enum → equal
        header: 'Loại vật nuôi',
        sortable: true
    },
    {
        field: 'quantityStart',
        type: 'text',
        operator: 'equal',
        header: 'Số lượng ban đầu',
        sortable: true
    },
    {
        field: 'quantityCurrent',
        type: 'text',
        operator: 'equal',
        header: 'Số lượng hien tai',
        sortable: true
    },
    {
        field: 'startDate',
        type: 'text',
        operator: 'equal',
        header: 'Ngày bắt đầu',
        sortable: true
    },
    {
        field: 'expectedEndDate',
        type: 'date',
        operator: 'like',   // ngày → nên between
        header: 'Ngày ngày thu hoach',
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
        field: 'note',
        type: 'text',
        operator: 'like',
        header: 'Ghi chú',
        sortable: false
    }
];
