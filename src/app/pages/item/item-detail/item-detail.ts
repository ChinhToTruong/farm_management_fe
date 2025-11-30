import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Category } from '@/pages/category/category-detail/category-detail';
import { LocationType } from '@/commons/type/location';
import { ToastService } from '@/pages/service/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { NgIf } from '@angular/common';
import { ItemService } from '@/pages/service/item.service';
import { LocationService } from '@/pages/service/location.service';
import { CategoryService } from '@/pages/service/category.service';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';

export interface Item {
    id?: number;               // từ BaseEntity
    categoryId: number | null; // Nhóm vật tư
    category?: Category | null; // transient

    name: string | null;       // Tên vật tư
    unit: string | null;       // Đơn vị tính

    initialQuantity: number | null;  // Số lượng ban đầu
    reorderLevel: number | null;     // Ngưỡng cảnh báo
    currentQuantity: number | null;  // Số lượng hiện có

    locationId: number | null;       // ID kho/khu vực
    location?: LocationType | null;      // transient
}


@Component({
  selector: 'app-item-detail',
    imports: [
        Select,
        ReactiveFormsModule,
        FloatLabel,
        InputText,
        NgIf,
        Button,
        InputNumber
    ],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss',
})
export class ItemDetail implements OnInit {
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("item")item!: Item;

    categoryOptions!: Category[];
    locationOptions!: LocationType[]

    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;

    toast = inject(ToastService)
    form!: FormGroup;
    fb = inject(FormBuilder);

    itemService = inject(ItemService);
    locationService = inject(LocationService);
    categoryService = inject(CategoryService);


    ngOnInit(): void {

        this.initForm();
        if(this.mode == 'create'){
            this.editMode = true;
            return;
        }

        if(this.mode == 'update') {
            this.editMode = false;
            this.form.patchValue({
                id: this.item.id ?? null,
            })
        }

    }

    private initForm() {
        this.form = this.fb.group({
            id: [this.item?.id ?? null],
            categoryId: [this.item?.categoryId ?? null, Validators.required],
            name: [this.item?.name ?? '', Validators.required],
            unit: [this.item?.unit ?? '', Validators.required],
            initialQuantity: [this.item?.initialQuantity ?? 0, [Validators.required, Validators.min(0)]],
            reorderLevel: [this.item?.reorderLevel ?? 0, [Validators.required, Validators.min(0)]],
            currentQuantity: [this.item?.currentQuantity ?? 0, [Validators.required, Validators.min(0)]],
            locationId: [this.item?.locationId ?? null, Validators.required]
        });



        this.categoryService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.categoryOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })

        this.locationService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.locationOptions =  response.data.content;
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
                id: this.item?.id || null
            };

            if (this.mode == 'create') {
                this.itemService.create(updateEntity).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.itemService.update(updateEntity).subscribe({
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
