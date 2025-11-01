import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
    private apiUrl = 'http://localhost:8080'; // API backend
    private currentUserSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {
        // Kiểm tra token khi load app
        const user = localStorage.getItem('user');
        if (user) this.currentUserSubject.next(JSON.parse(user));
    }

    // Observable để các component subscribe
    get currentUser(): Observable<any> {
        return this.currentUserSubject.asObservable();
    }

    get isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
    }

    logout() {
        const user = localStorage.getItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        return this.http.post<any>(`${this.apiUrl}/auth/logout`, { user: user });
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return throwError(() => new Error('No refresh token'));
        const headers = { 'Authorization': `Bearer ${refreshToken}` };
        return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`,null, {headers})
            .pipe(
                tap(res => {
                    // Lưu access token mới
                    localStorage.setItem('token', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                })
            );
    }
}
