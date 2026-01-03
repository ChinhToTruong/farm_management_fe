import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Item } from '@/pages/item/item-detail/item-detail';
import { AnimalService, AnimalType } from '@/pages/service/animal.service';
import { PlantService, PlantType } from '@/pages/service/plant.service';
import { User } from '@/pages/service/user.service';
import { ToastService } from '@/pages/service/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { formatDate, NgIf } from '@angular/common';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { BASE_SEARCH_REQUEST } from '@/pages/crop-season/commons/constants';
import { InventoryTransactionService } from '@/pages/service/inventory-transaction.service';
import { ItemService } from '@/pages/service/item.service';

export type InventoryTransactionType = 'IMPORT' | 'CONSUME' | 'ADJUST';
export const INVENTORY_TRANSACTION_TYPE_LABEL: Record<InventoryTransactionType, string> = {
    IMPORT: 'Nhập kho',
    CONSUME: 'Xuất / Sử dụng',
    ADJUST: 'Điều chỉnh tồn kho'
};
export interface InventoryTransaction {
    id?: number;  // từ BaseEntity

    itemId: number | null;       // ID vật tư
    item?: Item | null;          // transient
    itemName?: string;

    transactionType: InventoryTransactionType; // Loại giao dịch

    quantity: number | null;     // Số lượng thay đổi
    unitPrice?: number | null;   // Giá mỗi đơn vị
    totalAmount?: number | null; // Thành tiền = quantity × unitPrice

    transactionDate: Date | null; // Ngày giao dịch
    note?: string | null;         // Ghi chú

    relatedAnimalBatchId?: number | null; // Nếu liên quan đến đàn vật nuôi
    relatedAnimalBatch?: AnimalType | null; // transient
    batchName?: string | null;

    relatedPlantId?: number | null;  // Nếu liên quan đến cây trồng
    relatedPlant?: PlantType | null;     // transient
    plantName?: string | null;
}

@Component({
  selector: 'app-inventory-transaction-detail',
    imports: [
        Select,
        ReactiveFormsModule,
        DatePicker,
        FloatLabel,
        NgIf,
        Textarea,
        Button,
        InputNumber
    ],
  templateUrl: './inventory-transaction-detail.html',
  styleUrl: './inventory-transaction-detail.scss',
})
export class InventoryTransactionDetail implements OnInit {
    @Input("mode") mode: string = 'update';
    @Output("onSubmit") onSubmitEvent = new EventEmitter<any>();
    @Input("transaction")transaction!: InventoryTransaction;

    userOptions!: User[];
    batchOptions!: AnimalType[]
    itemOptions!: Item[];

    editMode: boolean = false;
    loading: boolean = false;
    readonly : boolean = false;
    id!: number;

    toast = inject(ToastService)
    form!: FormGroup;
    fb = inject(FormBuilder);
    transactionTypeOptions!: {
        label: string;
        value: InventoryTransactionType;
    }[];
    inventoryTransactionService = inject(InventoryTransactionService);

    itemService = inject(ItemService);
    plantService = inject(PlantService);
    animalService = inject(AnimalService);
    plantOptions!: PlantType[];


    ngOnInit(): void {
        this.transactionTypeOptions = Object.entries(INVENTORY_TRANSACTION_TYPE_LABEL).map(
            ([value, label]) => ({
                label,                           // 👈 hiển thị: Nhập kho / Xuất / Điều chỉnh
                value: value as InventoryTransactionType
            })
        );
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
                id: this.transaction.id ?? null,
                itemId: this.transaction.itemId ?? null,
                transactionType: this.transaction.transactionType ?? null,
                quantity: this.transaction.quantity ?? null,
                unitPrice: this.transaction.unitPrice ?? 0,
                totalAmount: this.transaction.totalAmount ?? 0,
                transactionDate: this.transaction.transactionDate
                    ? new Date(this.transaction.transactionDate)
                    : new Date(),
                note: this.transaction.note ?? '',
                relatedAnimalBatchId: this.transaction.relatedAnimalBatchId ?? null,
                relatedPlantId: this.transaction.relatedPlantId ?? null
            })
        }

    }

    private initForm() {
        this.form = this.fb.group({
            itemId: ['', Validators.required],
            transactionType: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            unitPrice: ['', [Validators.min(0)]],
            totalAmount: [{ value: this.transaction?.totalAmount ?? 0, disabled: true }],
            transactionDate: [new Date(), Validators.required],
            note: [''],
            relatedAnimalBatchId: [''],
            relatedPlantId: ['']
        });



        this.itemService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.itemOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })

        this.animalService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.batchOptions =  response.data.content;
            },
            error: error => this.toast.error(error.message),
        })

        this.plantService.search(BASE_SEARCH_REQUEST).subscribe({
            next: response => {
                this.plantOptions =  response.data.content;
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
                id: this.transaction?.id || null,
                transactionDate: formatDate(this.form.value.transactionDate, 'dd/MM/yyyy HH:mm:ss', 'en-US'),
            };

            if (this.mode == 'create') {
                this.inventoryTransactionService.create(updateEntity).subscribe({
                    next: (result) => {
                        this.toast.success("Them moi thanh cong")
                        this.onSubmitEvent.emit()
                    },
                    error: error => this.toast.error(error)
                })
            }else {
                this.inventoryTransactionService.update(updateEntity).subscribe({
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
