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
import { WorkDiary, WorkDiaryDetail } from '@/pages/work-diary/work-diary-detail/work-diary-detail';
import { WorkDiaryService } from '@/pages/service/work-diary.service';
import { workDiaryColumns } from '@/pages/work-diary/common/constants';

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


    constructor(override service: WorkDiaryService) {
        super(service);
    }



    ngOnInit() {
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
