import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class ToastService {
    constructor(private messageService: MessageService) {
    }


    public success(message: string): void {
        console.log(message);
        this.messageService.add({
            detail: message,
            summary: "Success",
            severity: 'success',
        })
    }


    public error(message: string): void {
        console.log(message);
        this.messageService.add({
            detail: message,
            summary: "Error",
            severity: 'error',
        })
    }

    public warning(message: string): void {
        console.log(message);
        this.messageService.add({
            detail: message,
            summary: "Warning",
            severity: 'warn',
        })
    }

    public info(message: string): void {
        console.log(message);
        this.messageService.add({
            detail: message,
            summary: "Info",
            severity: 'info',
        })
    }
}
