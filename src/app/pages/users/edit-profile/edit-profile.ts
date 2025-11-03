import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { AvatarModule } from "primeng/avatar";
import { UserService } from '@/pages/service/user.service';
import { ToastService } from '@/pages/service/toast.service';
import { FileService } from '@/pages/service/file.service';
import { AuthService } from '@/pages/service/auth.service';
import { FileUpload } from "primeng/fileupload";
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-edit-profile',
    imports: [
    ReactiveFormsModule,
    CommonModule,
    FloatLabel, InputTextModule, FormsModule, Select,
    ButtonModule,
    AvatarModule,
    FileUpload
],
    templateUrl: './edit-profile.html',
    styleUrl: './edit-profile.scss'
})
export class EditProfile implements OnInit{
    user: any; // user từ backend hoặc localStorage
    avatar!: string;
    editMode: boolean = false;
    loading: boolean = false;

    status!: string[];

    form!: FormGroup;

    userService = inject(UserService);
    authService = inject(AuthService)
    fileService = inject(FileService)
    toast = inject(ToastService);

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.loading = false;
        this.editMode = false;
        this.status = ['ACTIVE', 'INACTIVE']
                this.form = this.fb.group({
            username: [this.user?.username || '', Validators.required],
            name: [this.user?.name || '', Validators.required],
            email: [this.user?.email || '', [Validators.required, Validators.email]],
            phone: [this.user?.phone || '', Validators.pattern(/^0[0-9]{9}$/)],
            status: [this.user?.status || '', Validators.required],
            dob: []
        });
        this.authService.current().subscribe({
            next: res => {
                this.user = res.data
                this.form.patchValue({
                    username: this.user?.username,
                    name: this.user?.name,
                    email: this.user?.email,
                    phone: this.user?.phone,
                    dob: this.user?.dob,
                    status: this.user?.status,
                })
            },
            error: err => this.toast.error()
        });
        if(this.user?.avatar !== undefined){
            
            debugger
            this.fileService.getFile(this.user.avatar).subscribe({
                next: res => {
                    this.avatar = res.data.base64
                },
                error: err => this.toast.error()
            })
        }
        this.form.disable()
    }

    toggleEdit() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.form.enable();
        } else {
            this.form.disable();
        }
    }

    submit() {
        if (this.form.invalid) {
            this.toast.warning("Thông tin không đúng định dạng")
            this.editMode = true
            this.form.markAllAsTouched();
        }

        else {
            this.editMode = false;
            this.loading = true;
            const updatedUser = {
                ...this.form.value,
                id: this.user.id
            };

            console.log()

            this.userService.update(updatedUser).subscribe({
                next: res => {
                    localStorage.setItem('user', JSON.stringify(res?.data))
                    this.toast.success('Cập nhật thông tin thành công!')
                },
                error: e => console.log(e)
            })
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
