import { Injectable, Injector } from '@angular/core';
import { Response, Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { configObject } from '../config.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IUser } from '../../models/user';
import { LoginForm } from '../../models/login-form.interface';
import { CookieService } from '../cookie.service';
import { Message } from 'primeng/primeng';

@Injectable()
export class AuthService {
    public msgs: Message[] = [];

    private apiUrl = configObject.apiUrl;
    private http: Http;

    constructor(
        injector: Injector,
        private router: Router,
        private cookieService: CookieService
        // private notifyService: NotificationsService
    ) {
        setTimeout(() => {
            this.http = injector.get(Http);
        });
    }

    public signup(params: IUser, isValid: Boolean) {

        let headers = new Headers();
        headers.set('Content-Type', 'application/json');

        if (!isValid) { return false; }

        return this.http.post(`${this.apiUrl}/sign-up`, params, {headers})
            .map((res: Response) => res.json())
            .catch((error: any) => this.handleError(error))
            .subscribe((res) => {
                console.log(res);
                this.router.navigateByUrl('/auth/login');
            });
    }

    public signin(params: LoginForm, isValid: Boolean) {
        let headers = new Headers();
        let options = new RequestOptions({ headers, withCredentials: true });

        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers.set('Authorization', 'Basic YmxvY2hhbmd1bGFyYXBwOmJxcTZmaWM1OG5mY2Q4M3I3aHJj');

        let body = new URLSearchParams();

        body.set('username', params.username);
        body.set('password', params.password);
        body.set('grant_type', 'password');
        body.set('scope', 'read write');

        if (!isValid) { console.log('wwww'); return false; }

        return this.http.post(`${this.apiUrl}/oauth/token`, body, options)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                this.msgs.push({severity: 'error', summary: 'Login Error', detail: 'Username or password is incorrect'});
                return Observable.of(err);
            })
            .subscribe((res) => {
                if (res.access_token) {
                    localStorage.setItem('token', res.access_token);
                    localStorage.setItem('currentUser', res.userId);
                    /**
                     * mail service
                     */
                    // this.getEmails(res.access_token);

                    this.router.navigate(['/']);
                }
                if (res.refresh_token) {
                    this.cookieService.setCookie('refresh_token', res.refresh_token, 3600);
                }
            }, (err) => {
                console.log(err);
            });

    }
    public getEmails(token) {
        let headers = new Headers();
        let options = new RequestOptions({ headers, withCredentials: true });

        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', `Bearer ${token}`);

        return this.http.get(`${this.apiUrl}/user/accounts`, options)
            .map((res: Response) => res.json())
            .catch((error: any) => this.handleError(error))
            .subscribe((accounts) => {
                localStorage.setItem('accounts', JSON.stringify(accounts));
            });
    }

    public refreshToken() {
        let headers = new Headers();
        let options = new RequestOptions({ headers, withCredentials: true });
        localStorage.removeItem('token');

        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        headers.set('Authorization', 'Basic YmxvY2hhbmd1bGFyYXBwOmJxcTZmaWM1OG5mY2Q4M3I3aHJj');

        let refToken = this.cookieService.getCookie('refresh_token');

        let body = new URLSearchParams();

        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', `${refToken}`);

        return this.http.post(`${this.apiUrl}/oauth/token`, body, options)
            .map((response: Response) => {
                let returnedBody: any = response.json();
                if (typeof returnedBody.access_token !== 'undefined') {
                    localStorage.setItem('token', returnedBody.access_token);
                    localStorage.setItem('currentUser', returnedBody.userId);
                    return true;
                } else {
                    return false;
                }
            });
    }

    public logout() {
        localStorage.clear();
        this.router.navigate(['/app/auth/login']);
    }

    public isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    static get localStorageValue(): string {
        return localStorage.getItem('token') ? localStorage.getItem('token') : null;
    }

    private handleError(error: any): Observable<any> {
        this.msgs.push({severity: 'warn', summary: 'Registration Error', detail: `${error.status}`});
        return Observable.throw(error.json() || 'Server error');
    }
}
