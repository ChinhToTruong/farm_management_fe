import { Column } from '@/commons/type/app.table.type';

export const categoryColumns: Column[] = [

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
