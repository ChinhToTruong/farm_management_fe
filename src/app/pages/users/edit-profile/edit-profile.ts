import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { UserService } from '@/pages/service/user.service';
import { ToastService } from '@/pages/service/toast.service';
import { FileService } from '@/pages/service/file.service';
import { AuthService } from '@/pages/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { UserForm } from '../user-form/user-form';


interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'app-edit-profile',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule, FormsModule, ButtonModule,
        AvatarModule,
        UserForm
    ],
    templateUrl: './edit-profile.html',
    styleUrl: './edit-profile.scss',
    providers:[DynamicDialogRef, DynamicDialogConfig]
})
export class EditProfile{
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

}
