import { BaseService } from '@/pages/service/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CropSeason } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { LocationType } from '@/commons/type/location';
import { PlantStatus } from '@/pages/plant/plant-list/plant-list';


export interface PlantType {
    id?: number;
    plantName?: string;
    plantVariety?: string;
    quantity?: number;
    sowDate?: string;
    harvestDate?: string;
    status?: PlantStatus;
    statusName?: string;
    notes?: string;

    cropSeasonId?: number;
    cropSeasonName?: string;
    locationName?: string;
    locationId?: number;

    cropSeason?: CropSeason;
    location?: Location;
}

@Injectable({providedIn: 'root'})
export class PlantService extends BaseService<PlantType>{
    constructor(http: HttpClient) {
        super(http,"plants");
    }
}
