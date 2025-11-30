import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AnimalService, AnimalType } from '@/pages/service/animal.service';
import { WorkDiaryService } from '@/pages/service/work-diary.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate, NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { ToastService } from '@/pages/service/toast.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { User, UserService } from '@/pages/service/user.service';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { PlantService, PlantType } from '@/pages/service/plant.service';
import { CropSeasonService } from '@/pages/service/crop-season.service';

export class WorkDiary {
    id?: number;           // nếu BaseEntity có id
    createdAt?: string;    // nếu BaseEntity có createdAt
    updatedAt?: string;    // nếu BaseEntity có updatedAt

    userId?: number;

    cropSeasonId?: number;

    batchId?: number;

    plantId?: number;

    workDate?: string;      // dạng dd/MM/yyyy HH:mm:ss hoặc ISO

    taskName?: string;

    description?: string | null;

    status?: "PENDING" | "DONE" | "DELAYED";


    user!: User;
    animal!: AnimalType;
    cropSeason!: CropSeason;
    plant!: PlantType;
}

@Component({
  selector: 'app-work-diary-detail',
    imports: [
        Select,
        ReactiveFormsModule,
        DatePicker,
        FloatLabel,
        InputText,
        NgIf,
        Textarea,
        Button
    ],
  templateUrl: './work-diary-detail.html',
  styleUrl: './work-diary-detail.scss',
})
export class WorkDiaryDetail implements OnInit {
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("work-diary")workDiary!: WorkDiary;

    statusOptions!: string[];
    cropSeasonOptions!: CropSeason[];
    userOptions!: User[];

    batchOptions!: AnimalType[];
    plantOptions!: PlantType[];

    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;

    toast = inject(ToastService)
    form!: FormGroup;
    fb = inject(FormBuilder);

    workDiaryService = inject(WorkDiaryService);
    cropSeasonService = inject(CropSeasonService);
    userService = inject(UserService);
    plantService = inject(PlantService);
    animalService = inject(AnimalService);

    ngOnInit(): void {

        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.workDiary.id ?? null,
            })
        }


    }

    private initForm() {
        this.form = this.fb.group({
            id: [this.workDiary?.id ?? null],

            // --- IDs ---
            userId: [
                this.workDiary?.userId
                ?? this.workDiary?.user?.id
                ?? null,
                Validators.required
            ],

            cropSeasonId: [
                this.workDiary?.cropSeasonId
                ?? this.workDiary?.cropSeason?.id
                ?? null,
                Validators.required
            ],

            batchId: [
                this.workDiary?.batchId
                ?? this.workDiary?.batchId
                ?? null
            ],

            plantId: [
                this.workDiary?.plantId
                ?? this.workDiary?.plant?.id
                ?? null
            ],

            // --- Date ---
            workDate: [
                this.workDiary?.workDate
                    ? new Date(this.workDiary.workDate)
                    : null,
                Validators.required
            ],

            // --- Required fields ---
            taskName: [
                this.workDiary?.taskName ?? null,
                Validators.required
            ],

            status: [
                this.workDiary?.status ?? 'PENDING',
                Validators.required
            ],

            // --- Optional ---
            description: [this.workDiary?.description ?? null],

            // --- Transient objects (không submit lên server) ---
            user: [this.workDiary?.user ?? null],
            cropSeason: [this.workDiary?.cropSeason ?? null],
            batch: [this.workDiary?.batchId ?? null],
            plant: [this.workDiary?.plant ?? null]
        });

        this.statusOptions = ["PENDING" , "DONE" , "DELAYED"];

        this.cropSeasonService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                console.log(response);
                this.cropSeasonOptions =  response.data.content;
                console.log(this.cropSeasonOptions);
            },
            error: error => this.toast.error(error.message),
        })

        this.animalService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.batchOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })

        this.plantService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.plantOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })

        this.userService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.userOptions =  response.data.content;
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
            const updateWorkDiary = {
                ...this.form.value,
                id: this.workDiary?.id || null,
                workDate: formatDate(this.form.value.workDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
            };

            if (this.mode == 'create') {
                console.log(updateWorkDiary);
                this.workDiaryService.create(updateWorkDiary).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.workDiaryService.update(updateWorkDiary).subscribe({
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
