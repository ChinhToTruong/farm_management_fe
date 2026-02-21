import { Component, inject, OnInit } from '@angular/core';
import { BaseTableService } from '@/pages/service/base.table.service';
import { ToastService } from '@/pages/service/toast.service';
import { SearchRequest } from '@/pages/service/base.service';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { BASE_SEARCH_REQUEST, seasonColumns } from '@/pages/crop-season/commons/constants';
import { Column } from '@/commons/type/app.table.type';
import { CropSeasonDetail } from '@/pages/crop-season/crop-season-detail/crop-season-detail';
import { LocationType } from '@/commons/type/location';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { LocationService } from '@/pages/service/location.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


export interface CropSeason {
    id?: number;                // từ BaseEntity (nếu có id)
    createdAt?: string;         // nếu BaseEntity có
    updatedAt?: string;         // nếu BaseEntity có

    seasonName: string;
    startDate: string;          // LocalDateTime => string ISO
    endDate: string;            // LocalDateTime => string ISO

    type: CropSeasonType;

    status?: CropSeasonStatus;

    locationId?: number;

    location?: LocationType;        // Location interface
    description?: string;
}
export type CropSeasonType = 'ANIMAL' | 'CROP';
export type CropSeasonStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export const CROP_SEASON_TYPE_LABEL: Record<CropSeasonType, string> = {
    ANIMAL: 'Chăn nuôi',
    CROP: 'Trồng trọt'
};

export const CROP_SEASON_STATUS_LABEL: Record<
    CropSeasonStatus,
    string
> = {
    ACTIVE: 'Đang hoạt động',
    COMPLETED: 'Hoàn thành',
    PAUSED: 'Tạm dừng'
};

@Component({
  selector: 'app-crop-season-list',
    imports: [
        AppTable,
        Dialog,
        CropSeasonDetail,
        ConfirmDialogModule
    ],
    providers: [
        ConfirmationService
    ],
  templateUrl: './crop-season-list.html',
  styleUrl: './crop-season-list.scss',
})
export class CropSeasonList extends BaseTableService<CropSeason> implements OnInit {
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    protected cols!: Column[];
    cropSeason!: CropSeason;
    locationService = inject(LocationService);
    locations: Map<number, String> = new Map<number, String>();

    constructor(protected cropSeasonService: CropSeasonService) {
        super(cropSeasonService);
    }



    ngOnInit() {
        this.locationService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                response.data.content.forEach((item) => {
                    this.locations.set(item.id, item.locationName);
                })
            }
        })
        this.cols= seasonColumns
        this.filter()
    }


    selectionChange(item: any[]) {

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
                this.data = response.data.content.map((i: CropSeason) => ({
                    ...i,
                    type: CROP_SEASON_TYPE_LABEL[i.type],
                    status: i.status
                        ? CROP_SEASON_STATUS_LABEL[i.status]
                        : '',
                    locationId: i.locationId && this.locations.get(i.locationId) || ''
                }));
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
