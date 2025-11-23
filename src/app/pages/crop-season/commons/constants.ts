import { Column } from '@/commons/type/app.table.type';
import { SearchRequest } from '@/pages/service/base.service';

export const seasonColumns: Column[] = [
    {
        field: 'seasonName',
        type: 'text',
        operator: 'like',
        header: 'Tên mùa vụ',
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
        field: 'endDate',
        type: 'text',
        operator: 'like',
        header: 'Ngày kết thúc',
        sortable: true
    },
    {
        field: 'type',
        type: 'text',
        operator: 'like',
        header: 'Loại',
        sortable: true
    },
    {
        field: 'status',
        type: 'text',
        operator: 'like',
        header: 'Trạng thái',
        sortable: true
    },
    {
        field: 'location.locationName',
        type: 'text',
        operator: 'like',
        header: 'Khu vực',
        sortable: true
    }
];


export const BASE_SEARCH_REQUEST = {pageNo: 0, pageSize: 100, filters:[{}], sorts:[{field : "id", direction: 'ASC'}]} as SearchRequest
