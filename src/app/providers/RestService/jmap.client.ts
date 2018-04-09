import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { configObject } from '../config.service';
import { Observable } from 'rxjs';

@Injectable()
export class JmapClient {
    private jmapApiUrl = configObject.jmapApiUrl;

    constructor(private http: Http) {}

    public post(resource: string, filters: any) {
        filters = JSON.stringify(filters);

        let body = `[ "${resource}", ${filters}, "#0"]`;

        return this.request(body);
    }

    public postMany(resources: string[], filters: any[]) {
        let body = [];
        let results = (resources.length > filters.length) ? filters : resources;

        results.forEach((item, i) => {
            filters[i] = JSON.stringify(filters[i]);

            let call = `[ "${resources[i]}", ${filters[i]}, "call${i + 1}"]`;
            body.push(call);
        });
        return this.request(body);
    }

    public handleError(error: any): Observable<any> {
        return Observable.throw(error.json() || 'Server error');
    }

    private request(reqBody) {
        let body = `[${reqBody}]`;
        return this.http.post(this.jmapApiUrl, body, {headers: this.getAuthHeaders()});
    }

    private getAuthHeaders() {
        let accounts = JSON.parse(localStorage.getItem('accounts'));
        let token = accounts[0].token;
        let headers = new Headers();

        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', `Bearer ${token}`);

        return headers;
    }
}
