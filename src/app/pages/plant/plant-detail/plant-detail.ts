import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User, UserService } from '@/pages/service/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@/pages/service/toast.service';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { PlantService, PlantType } from '@/pages/service/plant.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { formatDate, NgIf } from '@angular/common';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { LocationType } from '@/commons/type/location';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-plant-detail',
    imports: [
        Select,
        ReactiveFormsModule,
        DatePicker,
        FloatLabel,
        InputText,
        NgIf,
        Textarea,
        Button,
        InputNumber
    ],
  templateUrl: './plant-detail.html',
  styleUrl: './plant-detail.scss',
})
export class PlantDetail {
    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("plant")plant!: PlantType;
    userOptions!: User[];
    cropSeasonOptions!: CropSeason[];
    locationOptions!: LocationType[];

    status!: string[];

    form!: FormGroup;
    locationTypes!: any[]
    toast = inject(ToastService);
    locationService = inject(LocationService);
    userService = inject(UserService);
    cropSeasonService = inject(CropSeasonService);
    plantService = inject(PlantService);
    statusOptions!: ({ label: string; value: string } | { label: string; value: string } | {
        label: string;
        value: string
    })[];


    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {

        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            this.form.patchValue({
                id: "",

                plantName: "",
                plantVariety: "",
                quantity: "",

                sowDate: "",
                harvestDate: "",

                status: "",
                description: "",

                cropSeasonId:
                    "",

                locationId:
                    "",
                cropSeason: "",
                location: "",
            })
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.plant.id ?? null,

                plantName: this.plant.plantName ?? null,
                plantVariety: this.plant.plantVariety ?? null,
                quantity: this.plant.quantity ?? null,

                sowDate: this.plant.sowDate ? new Date(this.plant.sowDate) : null,
                harvestDate: this.plant.harvestDate ? new Date(this.plant.harvestDate) : null,

                status: this.plant.status ?? 'GROWING',
                notes: this.plant.notes ?? null,

                cropSeasonId:
                    this.plant.cropSeasonId,

                locationId:
                    this.plant.locationId,
                cropSeason: this.plant.cropSeasonId,
                location: this.plant.location
            })
        }


    }

    private initForm() {
        this.form = this.fb.group(
            {
                id: [null],

                plantName: [null, Validators.required],
                plantVariety: [null, Validators.required],
                quantity: [null, [Validators.required, Validators.min(1)]],

                sowDate: [null, Validators.required],
                harvestDate: [null],

                status: ['GROWING', Validators.required],
                notes: [null],

                cropSeasonId: [null, Validators.required],
                locationId: [null, Validators.required],

                cropSeason: [null],  // để bind object khi update
                location: [null]
            }
        );

        this.status = ["GROWING", "HARVESTED", "FAILD"];
        this.statusOptions = [
            {
                label: 'Đang nuôi trồng',
                value: 'GROWING',
            },
            {
                label: 'Thu hoạch',
                value: 'HARVESTED',
            },
            {
                label: 'Thất bại',
                value: 'FAILD',
            }
        ]

        this.cropSeasonService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                console.log(response);
                this.cropSeasonOptions =  response.data.content;
                console.log(this.cropSeasonOptions);
            },
            error: error => this.toast.error(error.message),
        })

        this.locationService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.locationOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })
    }

    toggleEdit() {
        console.log(this.mode)
        if (this.mode == 'create') {
            this.onSubmitEvent.emit()
            return;
        }
        this.editMode = !this.editMode;
        this.form[this.editMode ? 'enable' : 'disable']();
    }

    submit() {
        if (this.form.invalid) {
            this.toast.warning("Thông tin không đúng định dạng")
            this.editMode = true
            this.form.markAllAsTouched();
        }
        else {
            // this.editMode = false;
            this.loading = true;
            const updatePlant = {
                ...this.form.value,
                id: this.plant?.id || null,
                harvestDate: formatDate(this.form.value.harvestDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                sowDate: formatDate(this.form.value.sowDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                location: null,
                cropSeason: null
            };

            if (this.mode == 'create') {
                this.plantService.create(updatePlant).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.plantService.update(updatePlant).subscribe({
                    next: (result) => {
                        this.toast.success("Cap nhat thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }
        }
    }
}
