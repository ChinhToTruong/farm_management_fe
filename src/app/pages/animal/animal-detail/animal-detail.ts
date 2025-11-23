import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PlantService, PlantType } from '@/pages/service/plant.service';
import { User, UserService } from '@/pages/service/user.service';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { LocationType } from '@/commons/type/location';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@/pages/service/toast.service';
import { LocationService } from '@/pages/service/location.service';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { formatDate, NgIf } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { AnimalService, AnimalType } from '@/pages/service/animal.service';

@Component({
  selector: 'app-animal-detail',
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
  templateUrl: './animal-detail.html',
  styleUrl: './animal-detail.scss',
})
export class AnimalDetail {
    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("animal")animal!: AnimalType;
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
    animalService = inject(AnimalService);


    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {

        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.animal.id ?? null,

                animalType: this.animal.animalType ?? null,
                batchName: this.animal.batchName ?? null,
                quantityStart: this.animal.quantityStart ?? null,
                quantityCurrent: this.animal.quantityCurrent ?? null,

                startDate: this.animal.startDate ? new Date(this.animal.startDate) : null,
                expectedEndDate: this.animal.expectedEndDate ? new Date(this.animal.expectedEndDate) : null,

                status: this.animal.status ?? 'ACTIVE',
                note: this.animal.note ?? null,

                cropSeasonId:
                this.animal.cropSeasonId,

                locationId:
                this.animal.locationId,
                cropSeason: this.animal.cropSeasonId,
                location: this.animal.location
            })
        }


    }

    private initForm() {
        this.form = this.fb.group(
            {
                id: [this.animal?.id ?? null],

                animalType: [this.animal?.animalType ?? null, Validators.required],
                batchName: [this.animal?.batchName ?? null, Validators.required],

                quantityStart: [
                    this.animal?.quantityStart ?? null,
                    [Validators.required, Validators.min(1)]
                ],

                quantityCurrent: [
                    this.animal?.quantityCurrent ?? null,
                    [Validators.required, Validators.min(0)]
                ],

                startDate: [
                    this.animal?.startDate ? new Date(this.animal.startDate) : null,
                    Validators.required
                ],

                expectedEndDate: [
                    this.animal?.expectedEndDate ? new Date(this.animal.expectedEndDate) : null
                ],

                status: [this.animal?.status ?? 'ACTIVE', Validators.required],
                note: [this.animal?.note ?? null],

                cropSeasonId: [
                    this.animal?.cropSeasonId
                    ?? this.animal?.cropSeason?.id
                    ?? null,
                    Validators.required
                ],

                locationId: [
                    this.animal?.locationId
                    ?? this.animal?.location?.id
                    ?? null,
                    Validators.required
                ],

                cropSeason: [this.animal?.cropSeason ?? null],
                location: [this.animal?.location ?? null]
            }
        );

        this.status = ["ACTIVE", "SOLD", "COMPLETED", "CANCELED"];

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
                id: this.animal?.id || null,
                expectedEndDate: formatDate(this.form.value.expectedEndDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                startDate: formatDate(this.form.value.startDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                location: null,
                cropSeason: null
            };

            if (this.mode == 'create') {
                this.animalService.create(updatePlant).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.animalService.update(updatePlant).subscribe({
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
