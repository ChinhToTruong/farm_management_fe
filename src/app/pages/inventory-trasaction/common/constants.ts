import { Column } from '@/commons/type/app.table.type';

export const inventoryTransactionColumns: Column[] = [
    {
        field: 'id',
        type: 'text',
        operator: 'like',
        header: 'ID',
        sortable: true
    },
    {
        field: 'itemId',
        type: 'text',
        operator: 'like',
        header: 'Vật tư (ID)',
        sortable: true
    },
    {
        field: 'transactionType',
        type: 'text',
        operator: 'like',
        header: 'Loại giao dịch',
        sortable: true
    },
    {
        field: 'quantity',
        type: 'text',
        operator: 'like',
        header: 'Số lượng',
        sortable: true
    },
    {
        field: 'unitPrice',
        type: 'text',
        operator: 'like',
        header: 'Đơn giá',
        sortable: true
    },
    {
        field: 'totalAmount',
        type: 'text',
        operator: 'like',
        header: 'Thành tiền',
        sortable: true
    },
    {
        field: 'transactionDate',
        type: 'text',
        operator: 'like',
        header: 'Ngày giao dịch',
        sortable: true
    },
    {
        field: 'note',
        type: 'text',
        operator: 'like',
        header: 'Ghi chú',
        sortable: false
    },
    {
        field: 'relatedAnimalBatchId',
        type: 'text',
        operator: 'like',
        header: 'Đàn vật nuôi (ID)',
        sortable: true
    },
    {
        field: 'relatedPlantId',
        type: 'text',
        operator: 'like',
        header: 'Cây trồng (ID)',
        sortable: true
    }
];

