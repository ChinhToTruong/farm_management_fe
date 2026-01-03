import { Component, inject } from '@angular/core';
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
import {
    WORK_DIARY_STATUS_LABEL,
    WorkDiary,
    WorkDiaryDetail, WorkDiaryStatus
} from '@/pages/work-diary/work-diary-detail/work-diary-detail';
import { WorkDiaryService } from '@/pages/service/work-diary.service';
import { workDiaryColumns } from '@/pages/work-diary/common/constants';
import { UserService } from '@/pages/service/user.service';
import { PlantService } from '@/pages/service/plant.service';
import { AnimalService } from '@/pages/service/animal.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';

@Component({
  selector: 'app-work-diary-list',
    imports: [
        AppTable,
        Dialog,
        WorkDiaryDetail
    ],
  templateUrl: './work-diary-list.html',
  styleUrl: './work-diary-list.scss',
})
export class WorkDiaryList extends BaseTableService<WorkDiary>{
    entities: WorkDiary[] = [];
    cols: any[] = []
    statuses: any[] = []
    statusMap!: ({ label: string; value: string } | { label: string; value: string } | {
    label: string;
    value: string
    })[];
    userMap= new Map<number, string>()
    cropSeasonMap= new Map<number, string>()
    batchMap= new Map<number, string>()
    plantMap= new Map<number, string>()
    title!: string;
    columns!: Column[];
    protected total: any;
    protected data!: any
    protected totalPages!: any;
    override toast = inject(ToastService);
    visible: boolean = false;
    mode: 'create' | 'update' = 'create';
    selectedEntity!: WorkDiary;
    locations!: LocationType[]
    seasons!:CropSeason[]

    cropSeasonService = inject(CropSeasonService)
    locationService = inject(LocationService)
    userService = inject(UserService)
    plantService = inject(PlantService)
    animalService = inject(AnimalService)



    constructor(override service: WorkDiaryService) {
        super(service);
    }



    ngOnInit() {
        this.statusMap = [
            { label: 'PENDING', value: 'Đang làm' },
            { label: 'DONE', value: 'Hoàn thành' },
            { label: 'DELAYED', value: 'Tạm hoãn' }
        ];
        this.userService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(user => {
                    if (user.id) {
                        this.userMap.set(user.id, user.name);
                    }
                });
            }
        })

        this.plantService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(user => {
                    if (user.id && user.plantName) {
                        this.plantMap.set(user.id, user.plantName);
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

        this.cropSeasonService.search(BASE_SEARCH_REQUEST).subscribe({
            next: res => {
                res.data.content.forEach(user => {
                    if (user.id && user.seasonName) {
                        this.cropSeasonMap.set(user.id, user.seasonName);
                    }
                });
            }
        })
        this.cols= workDiaryColumns
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
                        statusName: i.status
                        ? WORK_DIARY_STATUS_LABEL[i.status]
                        : '',
                        batchName: i.batchId
                            ? this.batchMap.get(i.batchId) ?? ''
                            : '',

                        userName: i.userId
                            ? this.userMap.get(i.userId) ?? ''
                            : '',

                        plantName: i.plantId
                            ? this.plantMap.get(i.plantId) ?? ''
                            : '',

                        cropSeasonName: i.cropSeasonId
                            ? this.cropSeasonMap.get(i.cropSeasonId) ?? ''
                            : '',
                    };
                })
                console.log(this.entities);
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
