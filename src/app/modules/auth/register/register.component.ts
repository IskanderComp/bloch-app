import { Component, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators } from '@angular/forms';
import { AuthService } from '../../../providers/AuthService/auth.service';

@Component({
    selector: 'bc-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy {

    constructor(
        public authService: AuthService
    ) {}

    public onSubmit(form) {
            console.log(form);

            this.authService.signup(form, true);
    }
    public ngOnDestroy() {
        this.authService.msgs = [];
    }
}
