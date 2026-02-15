import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast, ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast, ToastModule, ConfirmDialogModule],
    template: `
        <p-toast />
        <p-confirmDialog [style]="{ width: '420px' }" [baseZIndex]="10000"> </p-confirmDialog>
        <router-outlet />
    `
})
export class AppComponent {}
