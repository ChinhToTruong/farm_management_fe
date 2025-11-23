import { Component, inject, OnInit } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { User, UserService } from '@/pages/service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { EditProfile } from '@/pages/users/edit-profile/edit-profile';
import { Dialog } from "primeng/dialog";
import { UserForm } from "../user-form/user-form";
import { col } from './commons/constants';
import { SearchRequest } from '@/pages/service/base.service';
import { MOCK_USERS } from '@/pages/users/user-list/commons/mock-data';
import { Location } from '@angular/common';


@Component({
    selector: 'app-user-list',
    imports: [
        AppTable,
        Dialog,
        UserForm
    ],
    templateUrl: './user-list.html',
    styleUrl: './user-list.scss',
    providers: [DialogService],
})
export class UserList extends BaseTableService<any> implements OnInit {
    title!: string;
    columns!: Column[];
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' |'update' = 'create';
    location = inject(Location)
    user!: User;

    constructor(protected userService: UserService) {
        super(userService);
    }



    ngOnInit() {
        this.columns = col
        this.filter()
    }


    selectionChange(item: any[]) {
        this.toast.success("heeelllo")
        console.log("chay roi ne");
    }

    onNew() {
        this.visible = true
    }

    onSubmit() {
        this.visible = false
        this.filter()
    }


    override filter() {

        const par: SearchRequest = {
            pageNo: this.pageNo - 1,
            pageSize: this.pageSize,
            filters: this.filters,
            sorts: [
                {
                    field: this.id,
                    direction: 'ASC',
                }
            ]
        }
                // this.data = MOCK_USERS

            this.userService.search(par).subscribe({
                next: res => {
                    this.data = res.data.content
                    this.totalPages = res.data.totalPages
                    this.total = res.data.totalElements
                    console.log(this.total);
                },
                error: e => this.toast.error(e)
            })
    }

    onEdit(item: any){
        this.visible = true
        this.mode = 'update'
        this.user = item

    }

}
