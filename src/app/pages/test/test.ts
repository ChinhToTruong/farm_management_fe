import { Component, EventEmitter, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTable } from '@/layout/component/table/table';
import { Column } from '@/commons/type/app.table.type';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/pages/service/toast.service';



@Component({
    selector: 'app-test',
    standalone: true,
    templateUrl: './test.html',
    imports: [
        CommonModule,
        AppTable
    ],
    providers: [
        MessageService,
    ]
})
export class Test implements OnInit {
    title!: string;
    data!: any[];
    columns!: Column[];
    total: number = 100;

    toast = inject(ToastService);

    ngOnInit() {

        this.title = 'Test';
        this.columns= [
            {
                header: 'Tên nhân viên',
                field: 'name',
                type: 'text',
                operator: 'like',
                width: '200px',
                minWidth: '150px',
                sortable: true,
            },
            {
                header: 'Ngày sinh',
                field: 'birthDate',
                type: 'date',
                operator: 'equal',
                width: '150px',
                minWidth: '120px',
                sortable: true,
                customExportHeader: 'Date of Birth', // tùy chọn
            },
            {
                header: 'Phòng ban',
                field: 'department',
                type: 'select',
                operator: 'equal',
                width: '180px',
                minWidth: '150px',
                sortable: false,
            },
        ];

        this.data= [
            {
                id: 1,
                name: 'Nguyễn Văn A',
                birthDate: '1990-01-15',
                department: 'Kế toán',
            },
            {
                id: 2,
                name: 'Trần Thị B',
                birthDate: '1985-07-20',
                department: 'Nhân sự',
            },
            {
                id: 3,
                name: 'Lê Văn C',
                birthDate: '1992-03-10',
                department: 'IT',
            },
            {
                id: 4,
                name: 'Phạm Thị D',
                birthDate: '1998-11-05',
                department: 'Marketing',
            },
            {
                id: 5,
                name: 'Hoàng Văn E',
                birthDate: '1995-09-25',
                department: 'Bán hàng',
            },
        ]
    }

    selectionChange(item: any[]){
        console.log(item);
        this.toast.success("test")
    }

    onDeleteList(ids: any[]) {
        console.log(ids);
    }
}
