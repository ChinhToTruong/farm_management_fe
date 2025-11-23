import { Injectable } from '@angular/core';
import { BaseService } from '@/pages/service/base.service';
import { HttpClient } from '@angular/common/http';
import { Role } from '@/pages/service/user.service';


@Injectable({providedIn: 'root'})
export class RoleService extends BaseService<Role>{
    constructor(http: HttpClient) {
        super(http,"roles");
    }
}
