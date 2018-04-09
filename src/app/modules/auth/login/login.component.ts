import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../providers/alert.service';
import { AuthService } from '../../../providers/AuthService/auth.service';

@Component({
    selector: 'bc-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {

    public returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public authService: AuthService,
        // private alertService: AlertService
    ) {}

    public ngOnInit() {
        this.authService.logout();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    public onSubmit(form) {
        this.authService.signin(form, true);

            // .subscribe(
            //     data => {
            //         this.router.navigate([this.returnUrl]);
            //     },
            //     error => {
            //         this.alertService.error(error);
            //     });
    }
    public ngOnDestroy() {
        this.authService.msgs = [];
    }
}
