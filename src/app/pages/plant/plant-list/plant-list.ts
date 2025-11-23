import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-plant-list',
    imports: [
        AppTable,
        Dialog,
        PlantDetail
    ],
  templateUrl: './plant-list.html',
  styleUrl: './plant-list.scss',
})
export class PlantList extends BaseTableService<PlantType>{
    entities: PlantType[] = [];
    cols: any[] = []
    statuses: any[] = []

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
