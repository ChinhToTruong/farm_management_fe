import { AuthService } from '@/pages/service/auth.service';
import { FileService } from '@/pages/service/file.service';
import { ToastService } from '@/pages/service/toast.service';
import { Permission, Role, UserService } from '@/pages/service/user.service';
import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RoleService } from '@/pages/service/role.service';
import { PermissionService } from '@/pages/service/permission.service';
import { SearchRequest } from '@/pages/service/base.service';
import { Subject } from 'rxjs';


interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
  selector: 'app-user-form',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FloatLabel, InputTextModule, FormsModule, Select,
        ButtonModule,
        AvatarModule,
        FileUpload, DatePickerModule
    ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit, OnDestroy {
  @Input("user") user: any; // user từ backend hoặc localStorage
    avatar!: string;
    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();

    status!: string[];
    role: Role[] = [];
    permission: Permission[] = [];

    form!: FormGroup;

    userService = inject(UserService);
    authService = inject(AuthService)
    fileService = inject(FileService)
    toast = inject(ToastService);
    activeRouter = inject(ActivatedRoute)

    roleService = inject(RoleService);
    permissionService = inject(PermissionService);
    private destroy$ = new Subject<void>()

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.status = ['ACTIVE', 'INACTIVE'];
        this.roleService.search({pageNo: 0, pageSize: 100, filters:[{}], sorts:[{field : "id", direction: 'ASC'}]} as SearchRequest)
            .subscribe({
                next: response => {
                    console.log(response.data);
                    this.role = response.data.content
                },
                error: error => {
                    this.toast.error(error.error);
                }
            })
        this.permissionService.search({pageNo: 0, pageSize: 100, filters:[{}], sorts:[{field : "id", direction: 'ASC'}]} as SearchRequest)
            .subscribe({
                next: response => {
                    this.permission = response.data.content as Permission[]
                },
                error: error => {
                    this.toast.error(error.error);
                }
            })

        console.log(this.mode);
        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            debugger
            this.form.patchValue({
                username: '',
                name: '',
                email: '',
                phone: '',
                dob: '',
                status: '',
            });
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            const userObservable = this.user
                ? this.userService.getById(this.user.id)
                : this.authService.current();
            userObservable.subscribe({
                next: res => {
                    this.user = res.data;
                    console.log(this.user);
                    this.form.patchValue({
                        username: this.user?.username,
                        name: this.user?.name,
                        email: this.user?.email,
                        phone: this.user?.phone,
                        dob: formatDate(this.user?.dob, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
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
        }


    }

    private initForm() {
    this.form = this.fb.group({
        username: [ '', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.pattern(/^0[0-9]{9}$/)],
        status: ['', Validators.required],
        password: [],
        dob: [],
        permission: [],
        role: []
    });
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
                dob: formatDate(this.form.value.dob, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
                role: {id: this.form.value.role, permissions: [{id: this.form.value.permission}]},
                id: this.user?.id || null
            };

            if (this.mode == 'create') {
                this.userService.create(updatedUser).subscribe({
                    next: res => {
                        // localStorage.setItem('user', JSON.stringify(res?.data))
                        this.toast.success('Cập nhật thông tin thành công!')
                        this.onSubmitEvent.emit()
                        this.loading = false;
                    },
                    error: e => {
                        this.toast.error(e)
                        this.onSubmitEvent.emit()
                    }
                })
            }else {
                this.userService.update(updatedUser).subscribe({
                    next: res => {
                        // localStorage.setItem('user', JSON.stringify(res?.data))
                        this.toast.success('Cập nhật thông tin thành công!')
                        this.editMode = false
                    },
                    error: e => console.log(e)
                })
            }
        }
    }
    onFileSelected(event: UploadEvent) {
        console.log(event)
        const file = event.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        this.fileService.upload(formData).subscribe({
            next: (res) => {
                const fileName = res.data.fileName;
                this.fileService.getFile(fileName).subscribe({
                    next:  res => {
                        const base64Conent = res.data.base64Conent;
                        this.avatar = base64Conent
                    },
                    error: err => this.toast.error(err)
                })
            },
            error: (err) => this.toast.error(err)
        });
    }

    ngOnDestroy(): void {
        this.form.reset();
        this.form = null!;
    }

}
