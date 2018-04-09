import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../AuthService/auth.service';
import { CookieService } from '../cookie.service';

@Injectable()
export class HttpClient {

  constructor(private http: Http,
              private cookieService: CookieService,
              private authService: AuthService) {}

  public get(url, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.get(url, options)
        .catch((error: any) => this.handleErrors(error, 'get', url, options));
  }

  public post(url, data, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.post(url, data, options)
        .catch((error: any) => this.handleErrors(error, 'post', url, options));
  }

  public put(url, data, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.put(url, data, options)
        .catch((error: any) => this.handleErrors(error, 'put', url, options));
  }

  public patch(url, data, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.patch(url, data, options)
        .catch((error: any) => this.handleErrors(error, 'patch', url, options));
  }

  public delete(url, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.delete(url, options)
        .catch((error: any) => this.handleErrors(error, 'delete', url, options));
  }

  public options(url, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.options(url, options);
  }

  public head(url: string, options = {headers: new Headers()}) {
    this.createAuthoHeader(options.headers);
    return this.http.head(url, options);
  }

  public handleError(error: any): Observable<any> {
    return Observable.throw(error || 'Server error');
  }

  private handleErrors(error: any, method: string, url: string, options: any): any {
    let self = this;
    if (error.status === 401) {
      this.authService.refreshToken()
          .flatMap((result: boolean) => {
            // if got new access token - retry request
            if (result) {
              switch (method) {
                case 'post':
                  self.post(url, options).subscribe();
                  break;
                case 'put':
                  self.put(url, options).subscribe();
                  break;
                case 'patch':
                  self.patch(url, options).subscribe();
                  break;
                case 'delete':
                  self.delete(url, options).subscribe();
                  break;
                case 'get':
                default:
                  self.get(url, options).subscribe();
                  break;
              }
            } else {
              return Observable.throw(new Error('Can\'t refresh the token'));
            }
          });
    }

    return Observable.throw(error);
  }

  private createAuthoHeader(headers: Headers) {
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

    if (token) {
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
}
