import { Component, inject } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { LocationType } from '@/commons/type/location';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import {
    InventoryTransaction,
    InventoryTransactionDetail
} from '@/pages/inventory-trasaction/inventory-transaction-detail/inventory-transaction-detail';
import { InventoryTransactionService } from '@/pages/service/inventory-transaction.service';
import { inventoryTransactionColumns } from '@/pages/inventory-trasaction/common/constants';

@Component({
  selector: 'app-inventory-transaction-list',
    imports: [
        AppTable,
        Dialog,
        InventoryTransactionDetail
    ],
  templateUrl: './inventory-transaction-list.html',
  styleUrl: './inventory-transaction-list.scss',
})
export class InventoryTransactionList extends BaseTableService<InventoryTransaction>{
    entities: InventoryTransaction[] = [];
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
    selectedEntity!: InventoryTransaction;



    constructor(override service: InventoryTransactionService) {
        super(service);
    }



    ngOnInit() {
        this.cols= inventoryTransactionColumns
        this.filter()
    }


    selectionChange(item: any[]) {

    }

    onNew() {
        this.visible = true
        this.mode = 'create';
        console.log(this.mode);
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
