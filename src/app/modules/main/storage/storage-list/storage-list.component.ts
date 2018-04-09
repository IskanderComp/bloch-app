import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
    selector: 'storage-list',
    templateUrl: './storage-list.component.html'
})
export class StorageListComponent implements OnInit {

    constructor(
        private storageService: StorageService
    ) {}

    public getSharedFiles() {}
    public getFiles() {}
    public ngOnInit() {

        console.log('ascdfads');
    }
}
