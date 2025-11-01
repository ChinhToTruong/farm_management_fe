import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuService } from '@/cores/services/menu.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <div class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span [class]="item.icon"></span>
                    <li
                        app-menuitem
                        *ngIf="!item.separator"
                        [item]="item"
                        [index]="i"
                        [root]="true"
                        [routerLink]="item.routerLink"
                    ></li>
                </div>
            </ng-container>
        </ul> `
})
export class AppMenu {
    model: any[] = [];
    menuService = inject(MenuService);

    ngOnInit() {
        this.model = this.menuService.getMenu();
    }
}
