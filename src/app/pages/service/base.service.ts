import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResponseData<T> {
    message: string;
    code: string;
    errors: Record<string, string>;
    data: T;
}

export interface ListResponse<T> {
    content: T[];
    pageable: any;
    totalPages: number;
    totalElements: number;
    size: number;
}

export interface FilterRequest {
    field: string;
    value: string;
    operator: 'like' | 'equal' | 'equals';
}

export interface SortRequest {
    field: string;
    direction: 'ASC' | 'DESC';
}

export interface SearchRequest {
    pageNo: number;
    pageSize: number;
    filters: FilterRequest[];
    sorts: SortRequest[];
}

export abstract class BaseService<T>{
    protected baseUrl: string;

    protected constructor(protected http: HttpClient, url: string) {
        this.baseUrl = `http://localhost:8080/${url}`;
    }


    getById(id?: number): Observable<ResponseData<T>> {
        return this.http.get<ResponseData<T>>(`${this.baseUrl}/${id}`);
    }
    getData(): Observable<ResponseData<T>> {
        return this.http.get<ResponseData<T>>(`${this.baseUrl}`);
    }
    create(data: T): Observable<ResponseData<T>> {
        return this.http.post<ResponseData<T>>(this.baseUrl, data);
    }

    update(data: Partial<T>): Observable<ResponseData<T>> {
        return this.http.put<ResponseData<T>>(this.baseUrl, data);
    }

    delete(id: number): Observable<ResponseData<string>> {
        return this.http.delete<ResponseData<string>>(`${this.baseUrl}/${id}`);
    }

    deleteList(ids: number[]): Observable<ResponseData<string>> {
        return this.http.post<ResponseData<string>>(`${this.baseUrl}/delete-list`, ids);
    }

    search(params: SearchRequest): Observable<ResponseData<ListResponse<T>>> {
        return this.http.post<ResponseData<ListResponse<T>>>(`${this.baseUrl}/search`, params);
    }
}
