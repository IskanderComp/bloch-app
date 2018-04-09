import { Component, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import './storage.component.scss';
import { StorageService } from './storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
@Component({
    selector: 'bc-storage',
    templateUrl: 'storage.component.html'
})

export class StorageComponent {
    public formData: FormData;
    public files: UploadFile[];
    public uploadInput: EventEmitter<UploadInput>;
    public humanizeBytes: Function;
    public dragOver: boolean;

    public collapsedUpload: boolean = true;
    public modalRef: any;

    @ViewChild('modalFolder')
    private modalFolder: TemplateRef<any>;

    @ViewChild('uploadFile')
    private uploadFileValue: any;

    constructor(public storageService: StorageService,
                private modal: NgbModal) {
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
        // console.log(Mime());
    }

    public onUploadOutput(output: UploadOutput): void {
        console.log(output); // lets output to see what's going on in the console

        if (output.type === 'allAddedToQueue') {
            // when all files added in queue then start uploading automatically
            this.startUpload();
        } else if (output.type === 'addedToQueue') {
            this.files.push(output.file); // add file to array when added
        } else if (output.type === 'uploading') {
            // update current data in files array for uploading file
            const index = this.files.findIndex((file) => file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') { // drag over event
            this.dragOver = true;
        } else if (output.type === 'dragOut') { // drag out event
            this.dragOver = false;
        } else if (output.type === 'drop') { // on drop event
            this.dragOver = false;
        } else if (output.type === 'done') {
            if (output.file.response) {
                let f = output.file.response;
                if (f) {
                    f.name = f.childPath.replace(/^.*[\/]/, '');
                    f.fullUrl = `${this.storageService.storageUrl}/files/${f.id}/${f.name}`;
                    f.icon = this.storageService.getAvatarUrl(f);
                    this.storageService.files.push(f);

                    this.files = this.files.filter((file: UploadFile) => file !== output.file);
                    if (this.files.length === 0) {
                        this.reset();
                    }
                }
            }
        }
    }

    public startUpload(): void {
        let token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

        const event: UploadInput = {
            type: 'uploadAll',
            headers: { Authorization: `Bearer ${token}` },
            url: `${this.storageService.storageUrl}/fs/files`,
            method: 'POST',
            data: { multipart: 'form-data', parent: this.storageService.selectedDir.id },
            concurrency: 0
        };
        this.uploadInput.emit(event);
    }

    public cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id });
    }

    public closeUpload() {
        this.files = [];
        console.log(this.files);
    }
    public openFolderModal() {
        this.modalRef = this.modal.open(this.modalFolder, {size: 'sm'});
    }
    public addFolder() {
        this.uploadFileValue.nativeElement.value = '';
        this.openFolderModal();
    }
    public createFolder(folder) {
        this.storageService.createFolder(folder)
            .subscribe((f) => {
                this.storageService.folders.push(f);
                this.modalRef.close();
            });
    }

    public reset() {
        this.uploadFileValue.nativeElement.value = '';
    }

}
