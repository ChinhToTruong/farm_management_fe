import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuService } from '@/cores/services/menu.service';
import { menuConfig, RoleMenuItem } from '@/cores/config/menu.config';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <div class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                    <span [class]="item.icon"></span>
                    <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true" [routerLink]="item.routerLink"></li>
                </div>
            </ng-container>
        </ul>
    `,
    styles: [
        `
            .tw-icon {
                display: inline-block;
                width: 1.25rem; /* w-5 */
                height: 1.25rem; /* h-5 */
                background-color: currentColor;

                mask-size: contain;
                mask-repeat: no-repeat;
                mask-position: center;

                -webkit-mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
            }

            .tw-plant {
                mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 22V12m0 0c-3 0-6-2-6-6 4 0 6 2 6 6Zm0 0c3 0 6-2 6-6-4 0-6 2-6 6Z'/%3E%3C/svg%3E");
            }

            .tw-animal {
                mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M5 10c-1.7 0-3 1.3-3 3v4h2v-2h2v2h10v-2h2v2h2v-4c0-1.7-1.3-3-3-3h-1l-2-3H8L6 10H5zm4-2h6l1.5 2H7.5L9 8zm-3 7a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z'/%3E%3C/svg%3E");
            }
        `
    ]
})
export class AppMenu {
    model: RoleMenuItem[] = [];
    menuService = inject(MenuService);

    ngOnInit() {
        this.model = this.menuService.getMenu();
    }
}
