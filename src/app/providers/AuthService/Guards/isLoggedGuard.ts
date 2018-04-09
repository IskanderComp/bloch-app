import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Injectable()
export class IsLoggedGuard implements CanActivate {
    constructor(
        public router: Router,
        private authService: AuthService
    ) {}

    public canActivate() {
      if (!this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/auth');
        return false;
      }

      return Observable.of(true);
    }
}
