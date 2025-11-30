import { BaseService } from '@/pages/service/base.service';
import { WorkDiary } from '@/pages/work-diary/work-diary-detail/work-diary-detail';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({providedIn: 'root'})
export class WorkDiaryService extends BaseService<WorkDiary> {
    constructor(http: HttpClient) {
        super(http,"work-diaries");
    }
}
