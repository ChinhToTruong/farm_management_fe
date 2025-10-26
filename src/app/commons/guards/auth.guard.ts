import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@/pages/service/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    authService = inject(AuthService);
    router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authService.isLoggedIn) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }


}
