import { Component, inject } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { UserService } from '@/pages/service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { EditProfile } from '@/pages/users/edit-profile/edit-profile';

@Component({
  selector: 'app-user-list',
    imports: [
        AppTable
    ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
    providers: [DialogService],
})
export class UserList extends BaseTableService<any>{
    title!: string;
    data!: any[];
    columns!: Column[];
    total: number = 100;

    toast = inject(ToastService);
    dialogService = inject(DialogService);


    constructor(protected userService: UserService) {
        super(userService);
    }

    selectionChange(item: any[]){
        this.toast.success("heeelllo")
        console.log("chay roi ne");
    }

    onNew() {
        this.dialogService.open(EditProfile,
            {
                data: {
                    mode: "create",
                    readonly: false,
                    editMode: true
                }
            }
        )
    }
}
