import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VaccinationExportService {
  private readonly apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  export( enpoind: string='vaccinations/export',params?: Record<string, any>): Observable<any> {
    return this.http.get(this.apiUrl+enpoind, {
      params,
      responseType: 'json',
    });
  }
}