import { BaseTableService } from '@/pages/service/base.table.service';
import { Item } from '@/pages/item/item-detail/item-detail';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@/pages/service/base.service';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ItemService extends BaseService<Item>{
    constructor(http: HttpClient) {
        super(http,"items");
    }
}
