import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { formatDate, NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { UserService } from '@/pages/service/user.service';
import { AuthService } from '@/pages/service/auth.service';
import { FileService } from '@/pages/service/file.service';
import { ToastService } from '@/pages/service/toast.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';
import { CropSeasonService } from '@/pages/service/crop-season.service';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { BaseTableService } from '@/pages/service/base.table.service';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';

@Component({
  selector: 'app-crop-season-detail',
    imports: [
        Button,
        FloatLabel,
        FormsModule,
        InputText,
        NgIf,
        ReactiveFormsModule,
        Select,
        Textarea,
        DatePicker
    ],
  templateUrl: './crop-season-detail.html',
  styleUrl: './crop-season-detail.scss',
})
export class CropSeasonDetail {
    user: any; // user từ backend hoặc localStorage
    avatar!: string;
    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();

    status!: string[];
    form!: FormGroup;
    toast = inject(ToastService);
    locationService = inject(LocationService);
    typeOptions!: ({ label: string; value: string } | { label: string; value: string })[];
    statusOptions!: ({ label: string; value: string } | { label: string; value: string } | {
        label: string;
        value: string
    })[];
    // Location dropdown (nên gọi API)
    locationOptions: { label: string; value: string }[] = [];
    cropSeasonService = inject(CropSeasonService)
    @Input("cropSeason")cropSeason!: CropSeason

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {

        this.status = ['ACTIVE', 'INACTIVE'];


        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            if (this.cropSeason.id){
                this.cropSeasonService.getById(this.cropSeason.id).subscribe({
                    next: response => {
                        this.cropSeason = response.data
                        console.log(response.data);
                        this.form.patchValue({
                            seasonName: this.cropSeason.seasonName,
                            startDate: formatDate(this.cropSeason.startDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                            endDate: formatDate(this.cropSeason.endDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                            type: this.cropSeason.type,
                            status: this.cropSeason.status,
                            locationId: this.cropSeason.locationId,
                            location: this.cropSeason.locationId,
                            description: this.cropSeason.description
                        })
                    },
                    error: error => this.toast.error(error)
                })
            }
        }


    }

    private initForm() {
        this.form = this.fb.group({
            seasonName: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            type: ['CROP', Validators.pattern(/^ANIMAL|CROP$/)],
            status: ['ACTIVE', Validators.pattern(/^ACTIVE|COMPLETED|PAUSED$/)],
            location: [null, Validators.required], // ManyToOne
            description: ['']
        });

        this.locationService.search({pageNo: 0, pageSize: 100, filters:[{}], sorts:[{field : "id", direction: 'ASC'}]} as SearchRequest).subscribe({
            next: response => {
                console.log(response);
                this.locationOptions = response.data.content
                console.log(this.locationOptions);
            },
            error: error => this.toast.error(error.message),
        })

        this.typeOptions = [
            { label: 'Chăn nuôi', value: 'ANIMAL' },
            { label: 'Trồng trọt', value: 'CROP' }
        ];

        this.statusOptions = [
            { label: 'Hoạt động', value: 'ACTIVE' },
            { label: 'Hoàn thành', value: 'COMPLETED' },
            { label: 'Tạm dừng', value: 'PAUSED' }
        ];
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
            const updatedCropSeason = {
                ...this.form.value,
                id: this.cropSeason?.id || null,
                startDate: formatDate(this.form.value.startDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                endDate: formatDate(this.form.value.endDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                locationId: this.form.value.location,
                location: {
                    id: this.form.value.location,
                },
            };
            console.log(updatedCropSeason);
            if (this.mode == 'create') {
                this.cropSeasonService.create(updatedCropSeason).subscribe({
                    next: res => {
                        this.toast.success("Thêm mới thành công")
                        this.onSubmitEvent.emit()
                    },
                    error: e => {
                        this.toast.error(e)
                        this.onSubmitEvent.emit()
                    }
                })
            }else {
                this.cropSeasonService.update(updatedCropSeason).subscribe({
                    next: res => {
                        this.toast.success('Cập nhật thông tin thành công!')
                        this.editMode = false
                    },
                    error: e => console.log(e)
                })
            }
        }
    }
}
