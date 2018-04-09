import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        public router: Router) {}

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot){

            if(!this.authService.isLoggedIn()) {
                this.router.navigate(['/auth/login']);
                return false;
            }
            return true;
        // return this.authService.authInfo$
        //     .map(authInfo => authInfo.isLoggedIn())
        //     .take(1)
        //     .do(allowed => {
        //         if(!allowed){
        //             this.router.navigate(['/auth/login']);
        //         }
        //     });
    }
}
