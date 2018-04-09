import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthService } from '../AuthService/auth.service';
import { ErrorLogService } from '../error.log.service';

@Injectable()
export class HttpService extends Http {
    constructor(backend: XHRBackend, options: RequestOptions,
                private authService: AuthService, private errorLogService: ErrorLogService) {
        super(backend, options);

        let token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        if (token) {
            options.headers.set('Authorization', `${token}`);
        }
    }

    public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

        let token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        if (token) {
            if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
                if (!options) {
                    // let's make option object
                    options = {headers: new Headers()};
                }
                options.headers.set('Authorization', `Bearer ${token}`);

            } else {
                // we have to add the token to the url object
                url.headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return super.request(url, options)
          .catch((error) => {
              let code = error.json() && error.json().error;

              // if got authorization error - try to update access token
              if (error.status === 401 && code === 'invalid_token') {
                      return this.authService.refreshToken()
                          .flatMap((result: boolean) => {

                              // if got new access token - retry request
                              if (result) {
                                  return this.request(url, options);
                              } else {
                                  setTimeout(() => {
                                      this.authService.logout();
                                  });
                                  this.errorLogService.logError(new Error('Can\'t refresh the token'));
                                  return Observable.throw(new Error('Can\'t refresh the token'));
                              }
                          });
              } else {
                  this.errorLogService.logError(error);
                  Observable.throw(error);
              }
          });
    }

  private catchAuthError(self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        console.log(res);
      }
      return Observable.throw(res);
    };
  }
}
