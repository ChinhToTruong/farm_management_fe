import { Component, inject } from '@angular/core';
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
export class VaccinationList extends BaseTableService<Vaccination>{
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

    cropSeasonService = inject(CropSeasonService)
    locationService = inject(LocationService)


    constructor(override service: VaccinationService) {
        super(service);
    }



    ngOnInit() {
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
