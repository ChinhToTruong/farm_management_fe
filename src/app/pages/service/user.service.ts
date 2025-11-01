import { BaseService } from '@/pages/service/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Permission {
    id?: number;
    permissionName: string;
    permissionDescription: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface Role {
    id?: number;
    roleName: string;
    roleDescription: string;
    permissions: Permission[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | string;

    role: Role;

    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    deletedAt?: string;
}

@Injectable({providedIn: 'root'})
export class UserService extends BaseService<User>{

    constructor(http: HttpClient) {
        super(http,"users");
    }
}
