import { Injectable } from '@angular/core';
import { BaseService } from '@/pages/service/base.service';
import { HttpClient } from '@angular/common/http';
import { Permission } from '@/pages/service/user.service';

@Injectable({providedIn: 'root'})
export class PermissionService extends BaseService<Permission>{
    constructor(http: HttpClient) {
        super(http,"permissions");
    }
}
