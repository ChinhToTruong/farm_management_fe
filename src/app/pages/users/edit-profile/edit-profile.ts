import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { AvatarModule } from "primeng/avatar";
import { UserService } from '@/pages/service/user.service';
import { ToastService } from '@/pages/service/toast.service';

@Component({
    selector: 'app-edit-profile',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FloatLabel, InputTextModule, FormsModule, Select,
        ButtonModule,
        AvatarModule
    ],
    templateUrl: './edit-profile.html',
    styleUrl: './edit-profile.scss'
})
export class EditProfile {
    user: any; // user từ backend hoặc localStorage

    editMode: boolean = false;
    loading: boolean = false;

    status!: string[];

    form!: FormGroup;

    userService = inject(UserService);
    toast = inject(ToastService);

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.status = ['ACTIVE', 'INACTIVE']
        this.user = this.userService.current();

        this.form = this.fb.group({
            username: [this.user.username || '', Validators.required],
            name: [this.user.name || '', Validators.required],
            email: [this.user.email || '', [Validators.required, Validators.email]],
            phone: [this.user.phone || '', Validators.pattern(/^0[0-9]{9}$/)],
            status: [this.user.status || '', Validators.required]
        });
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
}
