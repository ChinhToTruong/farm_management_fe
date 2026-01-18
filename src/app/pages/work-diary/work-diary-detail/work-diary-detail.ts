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


export type WorkDiaryStatus = 'PENDING' | 'DONE' | 'DELAYED';
export const WORK_DIARY_STATUS_LABEL: Record<WorkDiaryStatus, string> = {
    PENDING: 'Chờ thực hiện',
    DONE: 'Hoàn thành',
    DELAYED: 'Trì hoãn'
};


export class WorkDiary {
    id?: number;           // nếu BaseEntity có id
    createdAt?: string;    // nếu BaseEntity có createdAt
    updatedAt?: string;    // nếu BaseEntity có updatedAt

    userId?: number;
    userName?: string;

    cropSeasonId?: number;

    cropSeasonName?: string;

    batchId?: number;
    batchName?: string;

    plantId?: number;
    plantName?: string;

    workDate?: string;      // dạng dd/MM/yyyy HH:mm:ss hoặc ISO

    taskName?: string;

    description?: string | null;

    status?: WorkDiaryStatus;
    statusName?: string;


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

    statusOptions!: ({ label: string; value: string } | { label: string; value: string } | {
        label: string;
        value: string
    })[];
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
            this.form.patchValue({
                id: "",
            })
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.workDiary.id ?? null,
                userId: this.workDiary.userId,
                cropSeasonId: this.workDiary.cropSeasonId,
                batchId: this.workDiary.batchId,
                plantId: this.workDiary.plantId,
                workDate: this.workDiary.workDate,
                taskName: this.workDiary.taskName,
                description: this.workDiary.description,
                status: this.workDiary.status,
            })
        }


    }

    private initForm() {
        this.form = this.fb.group({
            id: [""],

            // --- IDs ---
            userId: [
                "",
                Validators.required
            ],

            cropSeasonId: [
                Validators.required
            ],

            batchId: [
                ""
            ],

            plantId: [
                ''
            ],

            // --- Date ---
            workDate: [
                '',
                Validators.required
            ],

            // --- Required fields ---
            taskName: [
                '',
                Validators.required
            ],

            status: [
                'PENDING',
                Validators.required
            ],

            // --- Optional ---
            description: [''],

            // --- Transient objects (không submit lên server) ---
            user: [],
            cropSeason: [],
            batch: [],
            plant: []
        });

        this.statusOptions = [
            { label: 'Chờ xử lý', value: 'PENDING' },
            { label: 'Hoàn thành', value: 'DONE' },
            { label: 'Trì hoãn', value: 'DELAYED' }
        ];

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
