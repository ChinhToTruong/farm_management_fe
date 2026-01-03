import { Component, inject, OnInit } from '@angular/core';
import { AppTable } from '@/layout/component/table/table';
import { Dialog } from 'primeng/dialog';
import { Vaccination, VaccinationDetail } from '@/pages/vaccination/vaccination-detail/vaccination-detail';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';
import { LocationType } from '@/commons/type/location';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { LocationService } from '@/pages/service/location.service';
import { workDiaryColumns } from '@/pages/work-diary/common/constants';
import { SearchRequest } from '@/pages/service/base.service';
import { BaseTableService } from '@/pages/service/base.table.service';
import { VaccinationService } from '@/pages/service/vaccination.service';
import { vaccinationColumns } from '@/pages/vaccination/common/constants';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { UserService } from '@/pages/service/user.service';
import { PlantService } from '@/pages/service/plant.service';
import { AnimalService } from '@/pages/service/animal.service';

@Component({
  selector: 'app-vaccination-list',
    imports: [
        AppTable,
        Dialog,
        VaccinationDetail
    ],
  templateUrl: './vaccination-list.html',
  styleUrl: './vaccination-list.scss',
})
export class VaccinationList extends BaseTableService<Vaccination> implements OnInit {
    entities: Vaccination[] = [];
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
    selectedEntity!: Vaccination;
    locations!: LocationType[]
    userMap= new Map<number, string>()
    cropSeasonMap= new Map<number, string>()
    batchMap= new Map<number, string>()
    plantMap= new Map<number, string>()

    cropSeasonService = inject(CropSeasonService)
    locationService = inject(LocationService)
    userService = inject(UserService)
    plantService = inject(PlantService)
    animalService = inject(AnimalService)


    constructor(override service: VaccinationService) {
        super(service);
    }



    ngOnInit() {
        this.userService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(user => {
                    if (user.id) {
                        this.userMap.set(user.id, user.name);
                    }
                });
            }
        })

        this.animalService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(user => {
                    if (user.id && user.batchName) {
                        this.batchMap.set(user.id, user.batchName);
                    }
                });
            }
        })
        this.cols= vaccinationColumns
        this.filter()
    }


    selectionChange(item: any[]) {

    }

    onNew() {
        this.visible = true
        this.mode = 'create';
        console.log(this.mode);
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
                        batchName: i.batchId
                            ? this.batchMap.get(i.batchId) ?? ''
                            : '',

                        userName: i.userId
                            ? this.userMap.get(i.userId) ?? ''
                            : '',
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
