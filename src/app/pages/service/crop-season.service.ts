import { Inject, Injectable } from '@angular/core';
import { BaseService } from '@/pages/service/base.service';
import { CropSeason, CropSeasonList } from '@/pages/crop-season/crop-season-list/crop-season-list';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CropSeasonService extends BaseService<CropSeason>{
    constructor(http: HttpClient) {
        super(http,"crop-seasons");
    }
}
