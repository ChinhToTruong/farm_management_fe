import { BaseService } from '@/pages/service/base.service';
import {
    InventoryTransaction
} from '@/pages/inventory-trasaction/inventory-transaction-detail/inventory-transaction-detail';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class InventoryTransactionService extends BaseService<InventoryTransaction> {
    constructor(http: HttpClient) {
        super(http,"inventory-transactions");
    }
}
