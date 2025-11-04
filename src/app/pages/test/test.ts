import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTable } from '@/layout/component/table/table';
import { Column } from '@/commons/type/app.table.type';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/pages/service/toast.service';
import { User, UserService } from '@/pages/service/user.service';
import { FilterRequest, SearchRequest } from '@/pages/service/base.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-test',
    standalone: true,
    templateUrl: './test.html',
    imports: [
        CommonModule,
        AppTable
    ]
})
export class Test extends BaseTableService<User> implements OnInit {
    title!: string;
    data!: any[];
    columns!: Column[];
    total: number = 100;

    
    message = inject(MessageService)

    constructor(protected userService: UserService) {
        super(userService);
    }

    ngOnInit() {

        this.toast.success('Hello World!');
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
                field: 'dob',
                type: 'date',
                operator: 'equal',
                width: '150px',
                minWidth: '120px',
                sortable: true,
                customExportHeader: 'Date of Birth', // tùy chọn
            },
            {
                header: 'Email',
                field: 'email',
                type: 'select',
                operator: 'equal',
                width: '180px',
                minWidth: '150px',
                sortable: false,
            },
            {
                header: 'Số điện thoại',
                field: 'phone',
                type: 'select',
                operator: 'equal',
                width: '180px',
                minWidth: '150px',
                sortable: false,
            },
            {
                header: 'Trạng thái',
                field: 'status',
                type: 'select',
                operator: 'equal',
                width: '180px',
                minWidth: '150px',
                sortable: false,
            },
        ];

        this.filter()
    }

    selectionChange(item: any[]){
        this.toast.success("heeelllo")
        console.log("chay roi ne");
    }

    filter(){
        const params: SearchRequest = {
            pageNo: 0,
            pageSize: 10,
            filters: this.filters,
            sorts: [
                {
                    field: 'createdAt',
                    direction: 'DESC',
                }
            ]
        }
        this.userService.search(params).subscribe({
            next: (response: any) => {
                console.log(response);
                this.data = response.data.content
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }
}
