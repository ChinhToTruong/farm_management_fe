import { MenuItem } from 'primeng/api';

export type UserRole = 'ADMIN' | 'FARMER' | 'ENGINEER';

export interface RoleMenuItem extends MenuItem {
    roles?: UserRole[];
    children?: RoleMenuItem[];
}


export const menuConfig : RoleMenuItem[] =  [
    {
        label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: ['/'], roles: ['ADMIN', 'ENGINEER']
    },
    {
        label: 'Quản lý người dùng', icon: 'pi pi-fw pi-users', routerLink: ['/users'], roles: ['ADMIN']
    },
    {
        label: 'Quản lý khu vực', icon: 'pi pi-fw pi-map', routerLink: ['/locations'], roles: ['ADMIN']
    },
    {
        label: 'Quản lý vụ mùa', icon: 'pi pi-fw pi-calendar', routerLink: ['/crop-seasons'], roles: ['ADMIN']
    },
    {
        label: 'Quản lý cây trồng', icon: 'tw-icon tw-plant', routerLink: ['/plants'], roles: ['FARMER', 'ADMIN', 'ENGINEER']
    },
    {
        label: 'Quản lý cây vật nuôi', icon: 'tw-icon tw-animal', routerLink: ['/animals'], roles: ['FARMER', 'ADMIN', 'ENGINEER']
    },
    {
        label: 'Quản lý công việc hằng ngày', icon: 'pi pi-fw pi-clipboard', routerLink: ['/work-diaries'], roles: ['FARMER', 'ADMIN', 'ENGINEER']
    },
    {
        label: 'Quản lý tiêm phòng', icon: 'pi pi-fw pi-heart', routerLink: ['/vaccination'], roles: ['FARMER', 'ADMIN', 'ENGINEER']
    },
    {
        label: 'Quản lý kho', icon: 'pi pi-fw pi-warehouse', routerLink: ['/categories'], roles: ['ADMIN']
    },
    {
        label: 'Quản lý vật liệu', icon: 'pi pi-fw pi-box', routerLink: ['/items'], roles: ['ADMIN']
    },
    {
        label: 'Quản lý nhập/xuất kho', icon: 'pi pi-fw pi-arrow-right-arrow-left', routerLink: ['/inventory-transactions'], roles: ['ADMIN']
    },
    {
        label: 'Chat bot', icon: 'pi pi-fw pi-comments', routerLink: ['/chat-bot'], roles: ['FARMER', 'ADMIN', 'ENGINEER']
    },

    {
        label: 'Hierarchy',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            },
            {
                label: 'Submenu 2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 2.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                            { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                        ]
                    },
                    {
                        label: 'Submenu 2.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    }
                ]
            }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/documentation']
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-ng',
                target: '_blank'
            }
        ]
    }
];
