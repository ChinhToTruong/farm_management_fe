import { Component, inject } from '@angular/core';
import { BaseTableService } from '@/pages/service/base.table.service';
import { Item, ItemDetail } from '@/pages/item/item-detail/item-detail';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { LocationType } from '@/commons/type/location';
import { SearchRequest } from '@/pages/service/base.service';
import { ItemService } from '@/pages/service/item.service';
import { Category } from '@/pages/category/category-detail/category-detail';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { itemColumns } from '@/pages/item/common/constants';

@Component({
  selector: 'app-item-list',
    imports: [
        AppTable,
        Dialog,
        ItemDetail
    ],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList extends BaseTableService<Item>{
    entities: Item[] = [];
    cols: any[] = []
    statuses: any[] = []

    title!: string;
    columns!: Column[];
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    selectedEntity!: Item;
    locations!: LocationType[]
    categoryOptions!: Category[]


    constructor(override service: ItemService) {
        super(service);
    }



    ngOnInit() {
        this.cols= itemColumns
        this.filter()
    }


    selectionChange(item: any[]) {

    }

    onNew() {
        this.visible = true
        this.mode = 'create';
    }

    onSubmit() {
        this.visible = false
        this.filter()
    }


    override filter() {

        const par: SearchRequest = {
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

        this.service.search(par).subscribe({
            next: (result) => {
                console.log(result.data.content);
                this.entities = result.data.content.map(i => {
                    return {
                        ...i,
                    };
                })
                this.total = result.data.size
                this.totalPages = result.data.size
            },
            error: (err) => this.toast.error(err.message)
        })
    }

    onEdit(item: any) {
        this.visible = true
        this.mode = 'update'
        this.selectedEntity = item
    }
}
