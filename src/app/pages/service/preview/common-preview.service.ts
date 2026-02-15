import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VaccinationExportService } from './preview-service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-preview',
    imports: [DialogModule, ButtonModule, CommonModule],
    templateUrl: './preview.html',
    styleUrl: './preview.scss'
})
export class PreviewComponent {
    visible = false;
    title = 'Xem báo cáo';

    // PDF
    pdfUrl: SafeResourceUrl | null = null;

    // Excel
    isExcel = false;
    excelData: any[][] = [];
    excelBlob: Blob | null = null;
    // Common
    blob!: Blob;

    constructor(
        private sanitizer: DomSanitizer,
        private exportService: VaccinationExportService
    ) {}

    /* ========= PUBLIC API ========= */
    openPreview(title = 'Xem báo cáo', endpoint?: string, params?: any) {
        this.reset();
        this.title = title;

        this.exportService.export(endpoint, params).subscribe((res: any) => {
            const base64 = this.extractBase64(res);
            if (!base64) return;

            // Excel (xlsx luôn bắt đầu bằng UEsDB)
            if (base64.startsWith('UEsDB')) {
                this.previewExcel(base64);
                return;
            }

            // PDF
            this.previewPdf(base64);
        });
    }

    download() {
        let blob: Blob | null = null;
        let filename = '';

        if (this.isExcel && this.excelBlob) {
            blob = this.excelBlob;
            filename = 'report.xlsx';
        } else if (this.blob) {
            blob = this.blob;
            filename = 'report.pdf';
        }

        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    close() {
        this.reset();
    }

    /* ========= PREVIEW HANDLERS ========= */
    private previewPdf(base64: string) {
        const bytes = this.base64ToUint8Array(base64);
        const buffer = this.toArrayBuffer(bytes);

        this.blob = new Blob([buffer], { type: 'application/pdf' });

        const url = URL.createObjectURL(this.blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.visible = true;
    }

    private previewExcel(base64: string) {
        this.isExcel = true;
        const bytes = this.base64ToUint8Array(base64);
        const arrayBuffer = this.toArrayBuffer(bytes);

        this.excelBlob = new Blob([arrayBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const workbook = XLSX.read(bytes, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        this.excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        this.visible = true;
    }

    /* ========= UTIL ========= */
    private extractBase64(res: any): string | null {
        const base64 = typeof res === 'string' ? res : typeof res === 'object' ? res.data : null;

        if (!base64) {
            console.error('Base64 is undefined', res);
            return null;
        }

        return base64;
    }

    private base64ToBlob(base64: string, mime: string): Blob {
        const binary = atob(base64);
        const len = binary.length;

        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        // ✅ FIX LỖI SharedArrayBuffer
        const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

        return new Blob([buffer], { type: mime });
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    private reset() {
        this.visible = false;
        this.pdfUrl = null;
        this.isExcel = false;
        this.excelData = [];
    }

    private toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
        return bytes.slice().buffer;
    }
}
