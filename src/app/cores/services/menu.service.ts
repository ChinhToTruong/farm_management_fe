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

    filterMenuByRoles(menu: RoleMenuItem[], roles: string[]): any[] {
        return menu
            .map(item => {
                // Đệ quy nếu có submenu
                const filteredItems = item.items ? this.filterMenuByRoles(item.items, roles) : undefined;

                // Kiểm tra xem item có role nào khớp với roles được truyền vào không
                const hasMatchingRole =
                    Array.isArray(item.roles) && item.roles.some((r: string) => roles.includes(r));

                // Giữ lại nếu có role phù hợp hoặc có submenu con phù hợp
                if (hasMatchingRole || (filteredItems && filteredItems.length > 0)) {
                    return {
                        ...item,
                        items: filteredItems
                    };
                }

                // Loại bỏ item không có quyền
                return null;
            })
            .filter(Boolean);
    }

}
