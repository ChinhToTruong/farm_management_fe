import { Column } from '@/commons/type/app.table.type';

export const col: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'username',
        type: 'text',
        operator: 'like',
        header: 'Người dùng',
        sortable: true
    },
    {
        field: 'locationName',
        type: 'text',
        operator: 'like',
        header: 'Tên khu vực',
        sortable: true
    },
    {
        field: 'areaSize',
        type: 'text',
        operator: 'like',
        header: 'Diện tích',
        sortable: true
    },
    {
        field: 'type',
        type: 'text',
        operator: 'equal',   // type thường fixed value nên dùng bằng
        header: 'Loại hình',
        sortable: true
    },
    {
        field: 'description',
        type: 'text',
        operator: 'like',
        header: 'Mô tả',
        sortable: false
    }
]
