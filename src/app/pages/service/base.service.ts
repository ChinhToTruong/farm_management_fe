import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';

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

export abstract class BaseService<T> {
    protected baseUrl: string;
    role: FilterRequest = {
        field: 'userId',
        value: '',
        operator: 'equals'
    };
    isAdmin: boolean = false;
    protected constructor(
        protected http: HttpClient,
        url: string
    ) {
        this.baseUrl = `${enviroment.baseUrl}/${url}`;
    }
    checkRole() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const authorities = user.role.roleName;
        console.log('authorities', authorities);

        //    const check = authorities.find((i:any)=> i.authoritiy ==='FARMER' || i.authoritiy ==="ENGINEER");
        if (authorities) {
            this.role.value = user.id;
            this.isAdmin = false;
        } else {
            this.isAdmin = true;
        }
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

    search(params: SearchRequest, isRole: boolean = false): Observable<ResponseData<ListResponse<T>>> {
        this.checkRole();
        if (!this.isAdmin && isRole) {
            params.filters.push(this.role);
        }
        return this.http.post<ResponseData<ListResponse<T>>>(`${this.baseUrl}/search`, params);
    }
}
