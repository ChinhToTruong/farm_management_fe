import { BaseService, FilterRequest, SearchRequest } from '@/pages/service/base.service';
import { filter } from 'rxjs/operators';

export class BaseTableService<T> {
    id: string = 'id';
    filters!: FilterRequest[];
    pageNo: number = 1;
    pageSize: number = 10;
    constructor(protected service: BaseService<T>) {
    }



    onDelete(item: any) {

        this.service.delete(item.id).subscribe({
            next: data => {
                console.log(data);
            },
            error: err => {
                console.log(err);
            }
        })
    }

    onDeleteList(items: any[]){
        const ids = items.map(item => item.id);
        this.service.deleteList(ids).subscribe({
            next: data => {
                console.log(data);
            },
            error: err => {
                console.log(err);
            }
        })
    }

    onSearch(params: any): void  {
        this.filters = params;
        const par : SearchRequest = {
            pageNo: this.pageNo - 1,
            pageSize: this.pageSize,
            filters: this.filters,
            sorts: [
                {
                    field: this.id,
                    direction: 'ASC',
                }
            ]
        }
        console.log(params);
        this.service.search(par).subscribe({
            next: data => {
                console.log(data);
            },
            error: err => {
                console.log(err);
            }
        })
    }
}
