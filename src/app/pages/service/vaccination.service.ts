import { BaseService } from '@/pages/service/base.service';
import { Vaccination } from '@/pages/vaccination/vaccination-detail/vaccination-detail';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({providedIn: 'root'})
export class VaccinationService extends BaseService<Vaccination>{
    constructor(http: HttpClient) {
        super(http,"vaccinations");
    }
}
