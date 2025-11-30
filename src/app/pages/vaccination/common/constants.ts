import { Column } from '@/commons/type/app.table.type';

export const vaccinationColumns: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'animalBatchId',
        type: 'text',
        operator: 'like',
        header: 'Đàn vật nuôi (ID)',
        sortable: true
    },
    {
        field: 'vaccinationName',
        type: 'text',
        operator: 'like',
        header: 'Tên vắc xin',
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
        field: 'startDate',
        type: 'text',
        operator: 'like',
        header: 'Ngày bắt đầu',
        sortable: true
    },
    {
        field: 'nextDate',
        type: 'text',
        operator: 'like',
        header: 'Ngày tiếp theo',
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
