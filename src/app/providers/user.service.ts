import { Injectable } from '@angular/core';
import { HttpClient } from './RestService/rest.client';
import { configObject } from './config.service';
import { Response } from '@angular/http';

@Injectable()
export class UserService {
    private apiUrl = configObject.apiUrl;

    constructor (private http: HttpClient) {}

    public getAllUsers(q) {
        return this.http.get(`${this.apiUrl}/user`)
            .map((res: Response) => res.json());
            // .map((data) => {
            //     let contacts: any[] = data;
            //     data.forEach((d) => {
            //         if (d.email.indexOf(q) < 0) {
            //             contacts.push({email: q});
            //         }
            //     });
            //     console.log(data);
            //     return contacts;
            // });
    }
}
