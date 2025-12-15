import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { formatDate, NgIf } from '@angular/common';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { ToastService } from '@/pages/service/toast.service';
import { CategoryService } from '@/pages/service/category.service';

export interface Category {
    id?: number;            // từ BaseEntity
    name: string | null;
    description: string | null;
}



@Component({
  selector: 'app-category-detail',
    imports: [
        ReactiveFormsModule,
        FloatLabel,
        InputText,
        NgIf,
        Textarea,
        Button
    ],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail implements OnInit {
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("category") category!: Category;

    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;

    form!: FormGroup;

    fb = inject(FormBuilder)
    toast = inject(ToastService)

    categoryService =  inject(CategoryService)


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
                id: this.category.id ?? null,
            })
        }


    }

    private initForm() {
        this.form = this.fb.group({
            id: [this.category?.id ?? null],

            name: [this.category?.name ?? null],

            // --- Optional ---
            description: [this.category?.description ?? null],
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
            const updateWorkDiary = {
                ...this.form.value,
                id: this.category?.id || null
            };

            if (this.mode == 'create') {
                console.log(updateWorkDiary);
                this.categoryService.create(updateWorkDiary).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.categoryService.update(updateWorkDiary).subscribe({
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
