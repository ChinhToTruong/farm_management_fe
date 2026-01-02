import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductService } from '@/pages/service/product.service';
import { TooltipModule } from 'primeng/tooltip';
import { LocationService } from '@/pages/service/location.service';
import { LocationType } from '@/commons/type/location';
import { AppTable } from '@/layout/component/table/table';
import { BaseTableService } from '@/pages/service/base.table.service';
import { Column } from '@/commons/type/app.table.type';
import { ToastService } from '@/pages/service/toast.service';

import { SearchRequest } from '@/pages/service/base.service';
import { col } from '@/pages/location/common/constants';
import { LocationDetail } from '@/pages/location/location-detail/location-detail';


export interface LocationModel {
    id?: string;
    userId?: string;     // nếu dùng select user
    locationName: string;
    areaSize?: string;
    type: 'ANIMAL' | 'CROP' | 'MIXED';
    description: string;
}

export const LOCATION_TYPE_LABEL: Record<string, string> = {
    ANIMAL: 'Chăn nuôi',
    CROP: 'Trồng trọt',
    MIXED: 'Kết hợp'
};


@Component({
  selector: 'app-location',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        InputTextModule,
        ToolbarModule,
        TooltipModule,
        AppTable,
        LocationDetail
    ],
  templateUrl: './location.html',
  styleUrl: './location.scss',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class LocationList extends BaseTableService<LocationType>{
    locations: LocationType[] = [];
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
    selectedLocation!: LocationType;


    constructor(protected locationService: LocationService) {
        super(locationService);
    }



    ngOnInit() {
        this.cols= col
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

        this.locationService.search(par).subscribe({
            next: (result) => {
                console.log(result.data.content);
                this.locations = result.data.content.map(i => {
                    return {
                        ...i,
                        username: i.user.name,
                        type: LOCATION_TYPE_LABEL[i.type] ?? i.type
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
        this.selectedLocation = item
    }
}
