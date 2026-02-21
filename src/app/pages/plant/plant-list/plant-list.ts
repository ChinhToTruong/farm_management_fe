import { Component, inject, OnInit } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { SearchRequest } from '@/pages/service/base.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { PlantService, PlantType } from '@/pages/service/plant.service';
import { col } from '@/pages/plant/commons/constants';
import { PlantDetail } from '@/pages/plant/plant-detail/plant-detail';
import { LocationType } from '@/commons/type/location';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { LocationService } from '@/pages/service/location.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


export type PlantStatus = 'GROWING' | 'HARVESTED' | 'FAILD';

export const PLANT_STATUS_LABEL: Record<PlantStatus, string> = {
    GROWING: 'Đang trồng',
    HARVESTED: 'Đã thu hoạch',
    FAILD: 'Thất bại'
};

@Component({
  selector: 'app-plant-list',
    imports: [
        AppTable,
        Dialog,
        PlantDetail,
        ConfirmDialogModule
    ],
    providers: [
        ConfirmationService
    ],
  templateUrl: './plant-list.html',
  styleUrl: './plant-list.scss',
})
export class PlantList extends BaseTableService<PlantType> implements OnInit {
    entities: PlantType[] = [];
    cols: any[] = []
    statuses: any[] = []
    locationMap = new Map<number, string>();
    seasonMap = new Map<number, string>();

    title!: string;
    columns!: Column[];
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    selectedEntity!: PlantType;
    locations!: LocationType[]
    seasons!:CropSeason[]

    cropSeasonService = inject(CropSeasonService)
    locationService = inject(LocationService)


    constructor(override service: PlantService) {
        super(service);
    }



    ngOnInit() {
        this.locationService.search(BASE_SEARCH_REQUEST).subscribe(res => {
            res.data.content.forEach(l =>
                this.locationMap.set(l.id, l.locationName)
            );
        });
        this.cropSeasonService.search(BASE_SEARCH_REQUEST).subscribe(res => {
            res.data.content.forEach(s =>{
                if (s.id != null && s.seasonName) {
                    this.seasonMap.set(s.id, s.seasonName);
                }                }
            );
        });
        this.cols= col
        this.filter()
    }


    selectionChange(item: any[]) {

    }

    onNew() {
        this.visible = true
        this.mode = 'create';
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

        this.service.search(par).subscribe({
            next: (result) => {
                console.log(result.data.content);
                this.entities = result.data.content.map(i => {
                    return {
                        ...i,
                        statusName: i.status
                            ? PLANT_STATUS_LABEL[i.status]
                            : '',

                        locationName:
                            i.locationId != null
                                ? this.locationMap.get(i.locationId) ?? ''
                                : '',

                        cropSeasonName:
                            i.cropSeasonId != null
                                ? this.seasonMap.get(i.cropSeasonId) ?? ''
                                : ''
                    };
                })
                this.total = result.data.size
                this.totalPages = result.data.size
            },
            error: (err) => this.toast.error(err.message)
        })
    }

    onEdit(item: any) {
        this.visible = true
        this.mode = 'update'
        this.selectedEntity = item
    }
}
