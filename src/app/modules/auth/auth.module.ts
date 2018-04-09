import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { routing } from './auth.routes';
import { AuthService } from '../../providers/AuthService/auth.service';
import { CookieService } from '../../providers/cookie.service';
import { GrowlModule } from 'primeng/primeng';
import { IsPasswordConfirmedDirective } from '../../directives/password-confirm.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        GrowlModule
    ],
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent,
        IsPasswordConfirmedDirective
    ],
    providers: [
        AuthService,
        CookieService
    ]
})
export class AuthModule {}
