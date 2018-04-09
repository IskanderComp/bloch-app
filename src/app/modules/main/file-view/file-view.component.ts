import { Component, OnInit, ViewChild } from '@angular/core';

import './file-view.component.scss';
import { FileViewService } from './file-view.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { configObject } from '../../../providers/config.service';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { UtilService } from '../../../providers/util.service';

@Component({
    selector: 'file-view-ss',
    templateUrl: 'file-view.component.html'
})
export class FileViewComponent implements OnInit {
    public srcUrl: string;
    public fileModel: any;
    public size: any;
    public msgs: Message[] = [];
    public storageUrl = configObject.storageUrl;
    constructor(
        private utilService: UtilService,
        private route: ActivatedRoute,
        private router: Router,
        public fvService: FileViewService) {
        // this.fvService.fileSubject
        //     .subscribe((f) => {
        //         console.log('df', f);
        //         this.fileModel = f;
        //         console.log('df1', this.fileModel);
        //     });
    }

    public getItem() {
        this.fvService.getItem()
            // .catch((err: any) => {
            //     this.msgs.push({severity: 'error', summary: 'Privacy Message', detail: 'Sorry. File is private.'});
            //     return Observable.of(err);
            // })
            .subscribe((file: any) => {
                // this.fileModel = file;
                // this.fileSubject.next(this.fileModel);
                console.log('file', file);
                if (file.isDir) {
                    this.msgs.push({severity: 'warn', summary: 'Sharing Message', detail: 'Sorry, Sharing for folders not available.'});
                    // this.folders.push(f);
                } else {
                    // this.fileModel = file;
                    // let ext = file.childPath.replace(/^.*[.]/, '');
                    // if (ext === 'mp4') {
                    //     this.isImage = false;
                    // } else {
                    //     this.isImage = true;
                    // }
                    file.name = file.childPath.replace(/^.*[\/]/, '');
                    // file.fullUrl = `${this.storageUrl}/files/${file.id}/${file.name}`;
                    file.fullUrl = this.utilService.getFullUrl(this.storageUrl, file);
                    // this.srcUrl = file.fullUrl;
                    // this.loadImageVideo(file);
                    this.fileModel = file;
                }
            });
    }
    public ngOnInit() {
        this.fvService.itemId = this.route.snapshot.params['id'];
        this.getItem();
        console.log('id-v', this.route.snapshot.params['id']);

        console.log('id-fv', this.fvService.itemId);
        let size = this.route.snapshot.params['size'].split(/[xX]/);
        this.fvService.width = parseInt(size[0], 10);
        this.fvService.height = parseInt(size[1], 10);
        this.size = {
            width: this.fvService.width,
            height: this.fvService.height
        };
        this.fvService.getItem();

        console.log('item-fv', this.fileModel);
        // this.fileModel = this.fvService.fileModel;
        this.msgs = this.fvService.msgs;
    }
}
