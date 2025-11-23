import { BaseService } from '@/pages/service/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { LocationType } from '@/commons/type/location';


export interface AnimalType {
    id?: number;
    batchName?: string;
    animalType?: string;
    quantityStart?: number;
    quantityCurrent?: number;
    startDate?: string;
    expectedEndDate?: string;
    status?: 'ACTIVE'|'SOLD'|'COMPLETED'|'CANCELED';
    note?: string;

    cropSeasonId?: number;
    locationId?: number;

    cropSeason?: CropSeason;
    location?: LocationType;
}

@Injectable({providedIn: 'root'})
export class AnimalService extends BaseService<AnimalType>{
    constructor(http: HttpClient) {
        super(http,"animal-batch");
    }
}
