import { Injectable } from '@angular/core';
import { BaseService } from '@/pages/service/base.service';
import { HttpClient } from '@angular/common/http';

export interface Summary {
    workDate: string;   // dd/MM/yyyy
    status:  string;
    total: number;
}

@Injectable({providedIn: 'root'})
export class SummaryWorkDiary extends BaseService<Summary>{
    constructor(http: HttpClient) {
        super(http,"summary/work-diary");
    }
}
