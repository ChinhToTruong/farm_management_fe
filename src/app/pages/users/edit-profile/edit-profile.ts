import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { BestSellingWidget } from '@/pages/dashboard/components/bestsellingwidget';
import { NotificationsWidget } from '@/pages/dashboard/components/notificationswidget';
import { RecentSalesWidget } from '@/pages/dashboard/components/recentsaleswidget';
import { RevenueStreamWidget } from '@/pages/dashboard/components/revenuestreamwidget';
import { StatsWidget } from '@/pages/dashboard/components/statswidget';

@Component({
  selector: 'app-edit-profile',
    imports: [
        Card,
        ReactiveFormsModule,
        NgIf,
        InputText,
        BestSellingWidget,
        NotificationsWidget,
        RecentSalesWidget,
        RevenueStreamWidget,
        StatsWidget
    ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
    @Input() user: any; // user từ backend hoặc localStorage
    @Output() onSave = new EventEmitter<any>();

    form!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            fullName: [this.user?.fullName || '', Validators.required],
            email: [this.user?.email || '', [Validators.required, Validators.email]],
            phone: [this.user?.phone || '', Validators.pattern(/^0[0-9]{9}$/)],
            address: [this.user?.address || '']
        });
    }

    submit() {
        if (this.form.valid) {
            this.onSave.emit(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
