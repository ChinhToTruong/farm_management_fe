import { Column } from '@/commons/type/app.table.type';

export const itemColumns: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'categoryId',
        type: 'text',
        operator: 'like',
        header: 'Nhóm vật tư (ID)',
        sortable: true
    },
    {
        field: 'name',
        type: 'text',
        operator: 'like',
        header: 'Tên vật tư',
        sortable: true
    },
    {
        field: 'unit',
        type: 'text',
        operator: 'like',
        header: 'Đơn vị tính',
        sortable: true
    },
    {
        field: 'initialQuantity',
        type: 'text',
        operator: 'like',
        header: 'Số lượng ban đầu',
        sortable: true
    },
    {
        field: 'reorderLevel',
        type: 'text',
        operator: 'like',
        header: 'Ngưỡng cảnh báo',
        sortable: true
    },
    {
        field: 'currentQuantity',
        type: 'text',
        operator: 'like',
        header: 'Số lượng hiện có',
        sortable: true
    },
    {
        field: 'locationId',
        type: 'text',
        operator: 'like',
        header: 'Kho/Khu vực (ID)',
        sortable: true
    }
];
