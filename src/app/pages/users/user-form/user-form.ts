import { AuthService } from '@/pages/service/auth.service';
import { FileService } from '@/pages/service/file.service';
import { ToastService } from '@/pages/service/toast.service';
import { UserService } from '@/pages/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { take } from 'rxjs';



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
    FileUpload
],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
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

    userService = inject(UserService);
    authService = inject(AuthService)
    fileService = inject(FileService)
    toast = inject(ToastService);
    activeRouter = inject(ActivatedRoute)

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
        username: [this.user?.username || '', Validators.required],
        name: [this.user?.name || '', Validators.required],
        email: [this.user?.email || '', [Validators.required, Validators.email]],
        phone: [this.user?.phone || '', Validators.pattern(/^0[0-9]{9}$/)],
        status: [this.user?.status || '', Validators.required],
        password: [],
        dob: []
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
}
