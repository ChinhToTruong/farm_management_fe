import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AnimalDetail } from '@/pages/animal/animal-detail/animal-detail';
import { AnimalService, AnimalType } from '@/pages/service/animal.service';
import { User, UserService } from '@/pages/service/user.service';
import { WorkDiary } from '@/pages/work-diary/work-diary-detail/work-diary-detail';
import { Select } from 'primeng/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { formatDate, NgIf } from '@angular/common';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { ToastService } from '@/pages/service/toast.service';
import { VaccinationService } from '@/pages/service/vaccination.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { Subject } from 'rxjs';



export interface Vaccination {
    id?: number;

    // REAL DB FIELDS
    batchId: number | null;
    vaccinationName: string | null;
    userId: number | null;
    startDate: string | null;
    nextDate: string | null;
    note: string | null;

    // TRANSIENT FIELDS
    animalBatch?: AnimalType[] | null;
    user?: User | null;
}

@Component({
  selector: 'app-vaccination-detail',
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
  templateUrl: './vaccination-detail.html',
  styleUrl: './vaccination-detail.scss',
})
export class VaccinationDetail implements OnInit , OnDestroy {
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("vaccination")vaccination!: Vaccination;
    private destroy$ = new Subject<void>()
    userOptions!: User[];
    batchOptions!: AnimalType[]

    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;

    toast = inject(ToastService)
    form!: FormGroup;
    fb = inject(FormBuilder);

    vaccinationService = inject(VaccinationService);
    animalService = inject(AnimalService);
    userService = inject(UserService);

    ngOnInit(): void {
        console.log('mode: ', this.mode );
        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            debugger
            this.form.patchValue({
                id: "",
                userId: '',
                batchId: '',
                startDate: '',
                nextDate: '',
                note: '',
                vaccinationName:'',
            })
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.vaccination.id ?? null,
                userId: this.vaccination.userId ?? null,
                batchId: this.vaccination.batchId ?? null,
                startDate: this.vaccination.startDate ?? null,
                nextDate: this.vaccination.nextDate ?? null,
                note: this.vaccination.note ?? null,
                vaccinationName: this.vaccination.vaccinationName ?? null,
                // user: this.vaccination.user ?? null,
                // batch: this.vaccination.batchId ?? null,
            })
        }

    }

    private initForm() {
        this.form = this.fb.group({
            id: [''],

            // --- IDs ---
            userId: [
                '',
                Validators.required
            ],


            batchId: [
               ''
            ],


            // --- Date ---
            startDate : [
'',
                Validators.required
            ],

            nextDate: [
               '',
                Validators.required
            ],

            note: [''],

            vaccinationName: [''],

            // --- Transient objects (không submit lên server) ---
            user: [],
            batch: [],
        });



        this.animalService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.batchOptions =  response.data.content;
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
            const updateEntity = {
                ...this.form.value,
                id: this.vaccination?.id || null,
                startDate: formatDate(this.form.value.startDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                nextDate: formatDate(this.form.value.nextDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
            };

            if (this.mode == 'create') {
                this.vaccinationService.create(updateEntity).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.vaccinationService.update(updateEntity).subscribe({
                    next: (result) => {
                        this.toast.success("Cap nhat thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


}
