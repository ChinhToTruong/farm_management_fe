import { BaseService } from '@/pages/service/base.service';
import { Injectable } from '@angular/core';
import { Category } from '@/pages/category/category-detail/category-detail';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseService<Category>{
    constructor(http: HttpClient) {
        super(http,"categories");
    }
}
