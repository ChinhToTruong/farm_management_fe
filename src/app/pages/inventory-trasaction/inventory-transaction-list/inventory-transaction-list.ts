import { Component, inject, OnInit } from '@angular/core';
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
    INVENTORY_TRANSACTION_TYPE_LABEL,
    InventoryTransaction,
    InventoryTransactionDetail
} from '@/pages/inventory-trasaction/inventory-transaction-detail/inventory-transaction-detail';
import { InventoryTransactionService } from '@/pages/service/inventory-transaction.service';
import { inventoryTransactionColumns } from '@/pages/inventory-trasaction/common/constants';
import { AnimalService } from '@/pages/service/animal.service';
import { PlantService } from '@/pages/service/plant.service';
import { ItemService } from '@/pages/service/item.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';

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
export class InventoryTransactionList extends BaseTableService<InventoryTransaction> implements OnInit {
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
    animalService = inject(AnimalService);
    plantService = inject(PlantService);
    itemService = inject(ItemService);
    batchMap = new Map<number, string>();
    plantMap = new Map<number, string>();
    itemMap = new Map<number, string>();
    transactionMap = new Map<string, string>();



    constructor(override service: InventoryTransactionService) {
        super(service);
    }



    ngOnInit() {

        this.animalService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(a => {
                    if (a.id && a.batchName) {
                        this.batchMap.set(a.id, a.batchName);
                    }
                });
            }
        });
        this.plantService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(p => {
                    if (p.id && p.plantName) {
                        this.plantMap.set(p.id, p.plantName);
                    }
                });
            }
        });

        this.itemService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(i => {
                    if (i.id && i.name) {
                        this.itemMap.set(i.id, i.name);
                    }
                });
            }
        });
        this.cols= inventoryTransactionColumns
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
                        transactionTypeName: INVENTORY_TRANSACTION_TYPE_LABEL[i.transactionType],
                        batchName: i.relatedAnimalBatchId
                            ? this.batchMap.get(i.relatedAnimalBatchId) ?? ''
                            : '',

                        plantName: i.relatedPlantId
                            ? this.plantMap.get(i.relatedPlantId) ?? ''
                            : '',

                        itemName: i.itemId
                            ? this.itemMap.get(i.itemId) ?? ''
                            : '',
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
