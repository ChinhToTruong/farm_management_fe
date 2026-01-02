import { Component, inject, OnInit } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { LocationType } from '@/commons/type/location';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { ANIMAL_STATUS_LABEL, AnimalService, AnimalType } from '@/pages/service/animal.service';
import { AnimalDetail } from '@/pages/animal/animal-detail/animal-detail';
import { col } from '@/pages/animal/commons/constants';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';

@Component({
  selector: 'app-animal-list',
    imports: [
        AppTable,
        Dialog,
        AnimalDetail
    ],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.scss',
})
export class AnimalList extends BaseTableService<AnimalType> implements OnInit {
    entities: AnimalType[] = [];
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
    selectedEntity!: AnimalType;
    locations!: LocationType[]
    seasons!:CropSeason[]

    cropSeasonService = inject(CropSeasonService)
    locationService = inject(LocationService)


    constructor(override service: AnimalService) {
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
                            ? ANIMAL_STATUS_LABEL[i.status]
                            : '',
                        seasonName:
                            i.cropSeasonId != null
                                ? this.seasonMap.get(i.cropSeasonId) ?? ''
                                : '',

                        locationName:
                            i.locationId != null
                                ? this.locationMap.get(i.locationId) ?? ''
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
