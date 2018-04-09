import { Injectable } from '@angular/core';
import { HttpClient } from '../../../providers/RestService/rest.client';
import { configObject } from '../../../providers/config.service';
import { Observable } from 'rxjs/Observable';
import { Message } from 'primeng/primeng';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FileViewService {
    public storageUrl = configObject.storageUrl;
    public itemId: string;
    public width: number;
    public height: number;
    public msgs: Message[] = [];
    public fileModel: any;
    // public fileSubject = new BehaviorSubject(this.fileModel);
    // public fileModel: any = {
    //     childPath: '/files/GreatWhiteSharks.mp4',
    //     fullUrl: 'http://91.121.145.197:8767/video/df55f392-5a04-4b4e-a270-3cd460ec7aa1/GreatWhiteSharks.mp4',
    //     icon: {},
    //     id: 'df55f392-5a04-4b4e-a270-3cd460ec7aa1',
    //     isDir: false,
    //     isPublic: true,
    //     isShared: false,
    //     metaData: {
    //         caption: 'GreatWhiteSharks.jpg',
    //         is360: true,
    //         mimeType: 'video/mp4',
    //         quality: [240, 720, 480, 320]
    //     },
    //     name: 'GreatWhiteSharks.mp4',
    //     parent: 'aa288070-72ba-4fb4-9023-d8fb361f72a9',
    //     rootPath: '/',
    //     userId: '64c3d3bc-8d1a-4a22-a3a1-60dac4953e0e'
    // };
    constructor(
        private http: HttpClient) {
        console.log('cons fv', this.itemId);
    }

    public getItem() {
        return this.http.get(`${this.storageUrl}/fs/${this.itemId}`)
            .map((res: Response) => res.json());
    }
}
