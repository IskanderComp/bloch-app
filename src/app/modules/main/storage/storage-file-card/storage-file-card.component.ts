import { Component, Input, EventEmitter, Output } from '@angular/core';

import './storage-file-card.component.scss';

@Component({
    selector: 'storage-file-card',
    templateUrl: './storage-file-card.component.html'
})

export class StorageFileCardComponent {

    public selected: boolean = false;

    @Input()
    public fileUrl: string;
    @Input()
    public avatarUrl: string;
    @Input()
    public fileName: string;

    @Output()
    public delete = new EventEmitter();

}
