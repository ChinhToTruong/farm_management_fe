import { BaseService, FilterRequest, SearchRequest } from '@/pages/service/base.service';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ToastService } from './toast.service';

export abstract class BaseTableService<T> {
    protected id: string = 'id';
    protected filters!: FilterRequest[];
    protected pageNo: number = 1;
    protected pageSize: number = 10;
    toast = inject(ToastService)
    constructor(protected service: BaseService<T>) {
    }




    onDelete(item: any) {

        this.service.delete(item.id).subscribe({
            next: data => {
                this.toast.success("Xoá dữ liệu thành công")
            },
            error: err => {
                this.toast.error(err)
            }
        })
    }

    onDeleteList(items: any[]){
        const ids = items.map(item => item.id);
        this.service.deleteList(ids).subscribe({
             next: data => {
                this.toast.success("Xoá dữ liệu thành công")
            },
            error: err => {
                this.toast.error(err)
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
        this.filter()
    }

    abstract filter(): any;
}
