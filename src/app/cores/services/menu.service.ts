import { Injectable } from '@angular/core';
import { menuConfig, RoleMenuItem, UserRole } from '@/cores/config/menu.config';
import { MenuItem } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class MenuService {
    getMenu(): RoleMenuItem[] {
        const userJson = localStorage.getItem('user');
        if (!userJson) return [];

        const user = JSON.parse(userJson);
        const roles: UserRole[] = user.authorities?.map((a: {authority: string}) => a.authority) || [];

        return this.filterMenuByRoles(menuConfig, roles);
    }

    private filterMenuByRoles(menu: RoleMenuItem[], userRoles: string[]): RoleMenuItem[] {
        return menu
            .filter((x: RoleMenuItem) =>
                x.roles?.some(x =>
                    userRoles.includes(x)));

    }
}
