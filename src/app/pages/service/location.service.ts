import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationType } from '@/commons/type/location';
import { catchError, Observable, throwError } from 'rxjs';
import { BaseService, ResponseData } from '@/pages/service/base.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService extends BaseService<any>{

    constructor(http: HttpClient) {
        super(http,"locations");
    }

}
