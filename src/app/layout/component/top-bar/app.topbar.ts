import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';
import { AuthService } from '@/pages/service/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, TieredMenu],
    templateUrl: 'app.topbar.html',
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    profileItems: MenuItem[] | undefined;
    router = inject(Router);
    authService = inject(AuthService);

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngOnInit(): void {
        this.profileItems = [
            {
                label: 'Edit Profile',
                icon: 'pi pi-user-edit',
                command: () => this.onEditProfile()
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.onLogout()
            }
        ];
    }

    onEditProfile() {
        this.router.navigate(['/users/profile']);
    }

    onLogout() {
        console.log('onLogout');
        this.authService.logout().subscribe({
            next: (response) => {
                if (response) this.router.navigate(['/auth/login']);
            },
            error: (error) => {
                console.error(error);
            }
        });

    }
}
