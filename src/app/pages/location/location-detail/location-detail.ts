import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { User, UserService } from '@/pages/service/user.service';
import { AuthService } from '@/pages/service/auth.service';
import { FileService } from '@/pages/service/file.service';
import { ToastService } from '@/pages/service/toast.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Textarea } from 'primeng/textarea';
import { LocationType } from '@/commons/type/location';
import { LocationService } from '@/pages/service/location.service';
import { SearchRequest } from '@/pages/service/base.service';

@Component({
  selector: 'app-location-detail',
    imports: [
        Button,
        FileUpload,
        FloatLabel,
        FormsModule,
        InputText,
        NgIf,
        ReactiveFormsModule,
        Select,
        Textarea
    ],
  templateUrl: './location-detail.html',
  styleUrl: './location-detail.scss',
})
export class LocationDetail implements OnInit {
    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("location")location!: LocationType;
    userOptions!: User[];

    status!: string[];

    form!: FormGroup;
    locationTypes!: any[]
    toast = inject(ToastService);
    locationService = inject(LocationService);
    userService = inject(UserService);

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
            this.form.patchValue({
                id: this.location.id,
                userId: this.location?.user?.id,
                locationName: this.location.locationName,
                areaSize: this.location.areaSize,
                type: this.location.type,
                description: this.location.description,
            })
        }


    }

    private initForm() {
        this.form = this.fb.group({
            id: [null],
            userId: [null],
            locationName: [null],
            areaSize: [null],
            type: ['ANIMAL'],
            description: [null]
        });

        this.locationTypes = [
            { label: 'Chăn nuôi', value: 'ANIMAL' },
            { label: 'Trồng trọt', value: 'CROP' },
            { label: 'Kết hợp', value: 'MIXED' }
        ];

        this.userService.search({pageNo: 0, pageSize: 100, filters:[{}], sorts:[{field : "id", direction: 'ASC'}]} as SearchRequest).subscribe({
            next: response => {
                this.userOptions =  response.data.content.filter(user => user.role.roleName == 'FARMER')
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
            const updateLocation = {
                ...this.form.value,
                id: this.location?.id || null,
                user: {
                        id: this.form.value.userId
                    }
            };

            if (this.mode == 'create') {
                this.locationService.create(updateLocation).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.locationService.update(updateLocation).subscribe({
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
