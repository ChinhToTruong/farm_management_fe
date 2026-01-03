import { Component, inject, OnInit } from '@angular/core';
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
import { LocationService } from '@/pages/service/location.service';
import { CategoryService } from '@/pages/service/category.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';

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
export class ItemList extends BaseTableService<Item> implements OnInit{
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
    locationMap = new Map<number, string>()
    categoryMap = new Map<number, string>()
    locationService = inject(LocationService);
    categoryService = inject(CategoryService);


    constructor(override service: ItemService) {
        super(service);
    }



    ngOnInit() {
        this.locationService.search(BASE_SEARCH_REQUEST).subscribe({
            next: data => {
                data.data.content.forEach(item => {
                    if (item.id){
                        this.locationMap.set(item.id, item.locationName);
                    }
                })
            }
        })

        this.categoryService.search(BASE_SEARCH_REQUEST).subscribe({
            next: data => {
                data.data.content.forEach(item => {
                    if (item.id && item.name){
                        this.categoryMap.set(item.id, item.name);
                    }
                })
            }
        })
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
                        categoryName: i.categoryId ? this.categoryMap.get(i.categoryId) : '',
                        locationName: i.locationId ? this.locationMap.get(i.locationId) : ''
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
