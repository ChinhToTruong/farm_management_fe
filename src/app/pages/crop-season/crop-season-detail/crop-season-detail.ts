import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { UserService } from '@/pages/service/user.service';
import { AuthService } from '@/pages/service/auth.service';
import { FileService } from '@/pages/service/file.service';
import { ToastService } from '@/pages/service/toast.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';

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
    locationTypes!: any[]
    userService = inject(UserService);
    authService = inject(AuthService)
    fileService = inject(FileService)
    toast = inject(ToastService);
    activeRouter = inject(ActivatedRoute)
    typeOptions!: ({ label: string; value: string } | { label: string; value: string })[];
    statusOptions!: ({ label: string; value: string } | { label: string; value: string } | {
        label: string;
        value: string
    })[];
    // Location dropdown (nên gọi API)
    locationOptions: any[] = [];

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
            this.activeRouter.paramMap.pipe(take(1)).subscribe(params => {
                this.id = +params.get('id')!;
                this.readonly = !!this.id;

                const userObservable = this.readonly
                    ? this.userService.getById(this.id)
                    : this.authService.current();

                userObservable.subscribe({
                    next: res => {
                        this.user = res.data;
                        this.form.patchValue({
                            username: this.user?.username,
                            name: this.user?.name,
                            email: this.user?.email,
                            phone: this.user?.phone,
                            dob: this.user?.dob,
                            status: this.user?.status,
                        });

                        if (this.user?.avatar) {
                            this.fileService.getFile(this.user.avatar).subscribe({
                                next: res => this.avatar = res.data.base64,
                                error: () => this.toast.error()
                            });
                        }

                        if (this.readonly) {
                            this.form.disable();
                        }
                        this.loading = false;
                    },
                    error: () => this.toast.error()
                });
            });
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
            const updatedUser = {
                ...this.form.value,
                id: this.user?.id || null
            };

            if (this.mode == 'create') {
                this.userService.create(updatedUser).subscribe({
                    next: res => {
                        localStorage.setItem('user', JSON.stringify(res?.data))
                        this.toast.success('Cập nhật thông tin thành công!')
                        this.onSubmitEvent.emit()
                    },
                    error: e => {
                        this.toast.error(e)
                        this.onSubmitEvent.emit()
                    }
                })
            }else {
                this.userService.update(updatedUser).subscribe({
                    next: res => {
                        localStorage.setItem('user', JSON.stringify(res?.data))
                        this.toast.success('Cập nhật thông tin thành công!')
                        this.editMode = false
                    },
                    error: e => console.log(e)
                })
            }
        }
    }
}
