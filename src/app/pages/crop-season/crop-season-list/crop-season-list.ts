import { Component, inject } from '@angular/core';
import { BaseTableService } from '@/pages/service/base.table.service';
import { ToastService } from '@/pages/service/toast.service';
import { SearchRequest } from '@/pages/service/base.service';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { seasonColumns } from '@/pages/crop-season/commons/constants';
import { Column } from '@/commons/type/app.table.type';
import { CropSeasonDetail } from '@/pages/crop-season/crop-season-detail/crop-season-detail';
import { LocationType } from '@/commons/type/location';
import { CropSeasonService } from '@/pages/service/crop-season.service';


export interface CropSeason {
    id?: number;                // từ BaseEntity (nếu có id)
    createdAt?: string;         // nếu BaseEntity có
    updatedAt?: string;         // nếu BaseEntity có

    seasonName: string;
    startDate: string;          // LocalDateTime => string ISO
    endDate: string;            // LocalDateTime => string ISO

    type: 'ANIMAL' | 'CROP';

    status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';

    locationId?: number;

    location?: LocationType;        // Location interface
    description?: string;
}
@Component({
  selector: 'app-crop-season-list',
    imports: [
        AppTable,
        Dialog,
        CropSeasonDetail
    ],
  templateUrl: './crop-season-list.html',
  styleUrl: './crop-season-list.scss',
})
export class CropSeasonList extends BaseTableService<CropSeason>{
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    protected cols!: Column[];
    cropSeason!: CropSeason;

    constructor(protected cropSeasonService: CropSeasonService) {
        super(cropSeasonService);
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
        this.mode = 'create'
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

        this.cropSeasonService.search(par).subscribe({
            next: (response: any) => {
                this.data = response.data.content;
                this.totalPages = response.data.totalPages;
                this.total = response.data.size;
            }
        })
    }

    onEdit(item: any) {
        this.visible = true
        this.mode = 'update'
        this.cropSeason = item
    }

}
