import { Column } from '@/commons/type/app.table.type';

export const workDiaryColumns: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'userId',
        type: 'text',
        operator: 'like',
        header: 'Người thực hiện (ID)',
        sortable: true
    },
    {
        field: 'cropSeasonId',
        type: 'text',
        operator: 'like',
        header: 'Vụ mùa',
        sortable: true
    },
    {
        field: 'batchId',
        type: 'text',
        operator: 'like',
        header: 'Đàn vật nuôi',
        sortable: true
    },
    {
        field: 'plantId',
        type: 'text',
        operator: 'like',
        header: 'Cây trồng',
        sortable: true
    },
    {
        field: 'workDate',
        type: 'text',
        operator: 'like',
        header: 'Ngày thực hiện',
        sortable: true
    },
    {
        field: 'taskName',
        type: 'text',
        operator: 'like',
        header: 'Tên công việc',
        sortable: true
    },
    {
        field: 'description',
        type: 'text',
        operator: 'like',
        header: 'Mô tả',
        sortable: false
    },
    {
        field: 'status',
        type: 'text',
        operator: 'like',
        header: 'Trạng thái',
        sortable: true
    }
];

