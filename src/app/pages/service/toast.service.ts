import { Component, inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class ToastService {

    messageService = inject(MessageService);

    /** Thành công */
    success(detail: string, summary = 'Thành công', life = 3000) {
        debugger
        this.messageService.add({ severity: 'success', summary, detail, life });
    }

    /** Lỗi */
    error(detail: string, summary = 'Lỗi', life = 3000) {
        this.messageService.add({ severity: 'error', summary, detail, life });
    }

    /** Cảnh báo */
    warn(detail: string, summary = 'Cảnh báo', life = 3000) {
        this.messageService.add({ severity: 'warn', summary, detail, life });
    }

    /** Thông tin */
    info(detail: string, summary = 'Thông tin', life = 3000) {
        this.messageService.add({ severity: 'info', summary, detail, life });
    }

    /** Xóa tất cả toast */
    clear() {
        this.messageService.clear();
    }

}
