import { Column } from '@/commons/type/app.table.type';

export const categoryColumns: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'name',
        type: 'text',
        operator: 'like',
        header: 'Tên danh mục',
        sortable: true
    },
    {
        field: 'description',
        type: 'text',
        operator: 'like',
        header: 'Mô tả',
        sortable: false
    }
];
