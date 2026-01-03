import { Column } from '@/commons/type/app.table.type';

export const workDiaryColumns: Column[] = [
    {
        field: 'userName',
        type: 'text',
        operator: 'like',
        header: 'Người thực hiện (ID)',
        sortable: true
    },
    {
        field: 'cropSeasonName',
        type: 'text',
        operator: 'like',
        header: 'Vụ mùa',
        sortable: true
    },
    {
        field: 'batchName',
        type: 'text',
        operator: 'like',
        header: 'Đàn vật nuôi',
        sortable: true
    },
    {
        field: 'plantName',
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
        field: 'statusName',
        type: 'text',
        operator: 'like',
        header: 'Trạng thái',
        sortable: true
    }
];

