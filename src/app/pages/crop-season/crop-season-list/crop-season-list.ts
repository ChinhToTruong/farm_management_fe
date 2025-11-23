import { Component, inject } from '@angular/core';
import { BaseTableService } from '@/pages/service/base.table.service';
import { ToastService } from '@/pages/service/toast.service';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { LocationDetail } from '@/pages/location/location-detail/location-detail';
import { cropSeasonMockData } from '@/pages/crop-season/commons/crop-season.mock-data';
import { seasonColumns } from '@/pages/crop-season/commons/constants';
import { Column } from '@/commons/type/app.table.type';
import { CropSeasonDetail } from '@/pages/crop-season/crop-season-detail/crop-season-detail';

@Component({
  selector: 'app-crop-season-list',
    imports: [
        AppTable,
        Dialog,
        LocationDetail,
        CropSeasonDetail
    ],
  templateUrl: './crop-season-list.html',
  styleUrl: './crop-season-list.scss',
})
export class CropSeasonList extends BaseTableService<any>{
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    protected cols!: Column[];


    constructor(protected locationService: LocationService) {
        super(locationService);
    }



    ngOnInit() {
        this.cols= seasonColumns
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
        this.data = cropSeasonMockData
        console.log(this.data);

        // this.userService.search(par).subscribe({
        //     next: res => {
        //         // this.data = res.data.content
        //         // console.log(this.data);
        //         this.totalPages = res.data.totalPages
        //         this.total = res.data.size
        //     },
        //     error: e => console.log(e)
        // })
    }

    onEdit(item: any) {
        this.visible = true
        this.mode = 'update'
    }

}
