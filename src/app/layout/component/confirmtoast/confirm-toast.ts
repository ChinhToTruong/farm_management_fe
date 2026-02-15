import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class CommonConfirmService {
  constructor(private confirmService: ConfirmationService) {}

  confirm(options: {
    message: string;
    header?: string;
    accept?: () => void;
    reject?: () => void;
    acceptLabel?: string;
    rejectLabel?: string;
    icon?: string;
  }) {
    this.confirmService.confirm({
      message: options.message,
      header: options.header ?? 'Xác nhận',
      icon: options.icon ?? 'pi pi-exclamation-triangle',
      acceptLabel: options.acceptLabel ?? 'Đồng ý',
      rejectLabel: options.rejectLabel ?? 'Hủy',
      accept: options.accept,
      reject: options.reject,
    });
  }
}
