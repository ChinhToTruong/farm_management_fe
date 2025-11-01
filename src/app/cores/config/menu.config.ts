import { MenuItem } from 'primeng/api';

export type UserRole = 'ADMIN' | 'FARMER' | 'ENGINEER';

export interface RoleMenuItem extends MenuItem {
    roles?: UserRole[];
    children?: RoleMenuItem[];
}


export const menuConfig : RoleMenuItem[] = [
    {
        label: 'ADMIN',
        roles: ['ADMIN', 'FARMER', 'ENGINEER'],
        routerLink: '/auth/login',
        icon: 'pi pi-plus'
    },
    {
        label: 'FARMER',
        roles: ['FARMER', 'ENGINEER'],
        routerLink: "/",
        icon: 'pi pi-pencil'
    },
    {
        label: 'ENGINEER',
        roles: ['ENGINEER', 'ADMIN'],
        routerLink: '/login',
        icon: 'pi pi-pencil'
    }
];
