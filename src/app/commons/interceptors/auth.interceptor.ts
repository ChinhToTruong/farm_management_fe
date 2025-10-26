import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@/pages/service/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    authService = inject(AuthService);
    router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.authService.getToken();
        if (token) {
            authReq = this.addTokenHeader(req, token);
        }
        return next.handle(authReq).pipe(
            catchError(error => {
                // Nếu 401 và chưa refresh
                if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
                    this.isRefreshing = true;

                    const refreshToken = this.authService.getRefreshToken();
                    if (!refreshToken) {
                        // Không có refresh token => logout và chuyển hướng login
                        this.authService.logout().subscribe({
                            next: () => {
                                this.router.navigate(['/auth/login']);
                            },
                            error: err => throwError(() => new Error(err))
                        });
                        return throwError(() => new Error('No refresh token'));
                    }

                    // Thử refresh token
                    return this.authService.refreshToken().pipe(
                        switchMap((res) => {
                            this.isRefreshing = false;
                            return next.handle(this.addTokenHeader(req, res.accessToken));
                        }),
                        catchError(err => {
                            this.isRefreshing = false;
                            this.authService.logout();
                            this.router.navigate(['/auth/login']); // redirect về login
                            return throwError(() => err);
                        })
                    );
                }


                return throwError(() => new Error(error));
            })
        );

    }

    private addTokenHeader(req: HttpRequest<any>, token: string) {
        return req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    }

}
