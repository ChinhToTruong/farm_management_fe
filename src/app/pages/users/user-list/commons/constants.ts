import { Column } from "@/commons/type/app.table.type";

export const col: Column[] = [
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
        header: 'Tên',
        sortable: true
    },
    {
        field: 'dob',
        type: 'text',
        operator: 'like',
        header: 'Ngày sinh',
        sortable: true
    },
    {
        field: 'status',
        type: 'text',
        operator: 'like',
        header: 'Trạng thái',
        sortable: true
    },
]