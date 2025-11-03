import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class FileService {
    protected baseUrl: string = "http://localhost:8080/files";

    http = inject(HttpClient)


    upload(form: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/upload`, form)
    }

    getFile(fileName: string): Observable<any>{
        return this.http.get(`${this.baseUrl}/get-file/mybucket/${fileName}`)
    }
}