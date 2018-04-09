import {
    Component, OnInit, TemplateRef, ViewChild
} from '@angular/core';
import { StorageService } from '../storage.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, OverlayPanel, SelectItem } from 'primeng/primeng';
import { UtilService } from '../../../../providers/util.service';

@Component({
    selector: 'bc-storage-view',
    templateUrl: 'storage-view.component.html',
    styles: [`
        .isDeleted {
            opacity: .5;
        }
    `]
})

export class StorageViewComponent implements OnInit {

    public msgs: Message[] = [];
    public roles: SelectItem[] = [
        // { label: 'Owner', value: 'owner' },
        { label: 'View', value: 'reader' },
        { label: 'Edit', value: 'writer' }
    ];
    public selectedRole: string = 'reader';

    public shareModel: any = {};
    public currentContacts: any[] = [];
    public itemOwners: any[] = [];
    public allContacts: any[] = [];
    public playlists: any[] = [];
    public itemModel: any = {};
    public fileModel: any = {};
    public modalHeader: string;
    public privacySwitch: boolean;
    public filteredContactsMultiple: any[];

    public modalRef: any;
    public isAdvanced: boolean = false;
    public contacts: any[];
    public dir: string;

    public isCopied: boolean = false;
    @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
    @ViewChild('modalShare') private modalShare: TemplateRef<any>;
    @ViewChild('modalRename') private modalRename: TemplateRef<any>;
    @ViewChild('modalPlaylist') private modalPlaylist: TemplateRef<any>;
    @ViewChild('modalFileView') private modalFileView: TemplateRef<any>;
    @ViewChild('modalAdvanced') private modalAdvanced: TemplateRef<any>;
    @ViewChild('modalShareLink') private modalShareLink: TemplateRef<any>;
    @ViewChild('modalEmbed') private modalEmbed: TemplateRef<any>;

    constructor(
        private router: Router,
        private utilService: UtilService,
        private route: ActivatedRoute,
        private userService: UserService,
        private modal: NgbModal,
        public storageService: StorageService) {

        this.playlists = [
            {
                id: 1,
                title: 'Favorite',
                videos: []
            },
            {
                id: 2,
                title: 'PlayList 1',
                videos: []
            }
        ];
        route.params.forEach((params) => {
            console.log('Init');
            if (params['id']) {
                this.dir = params['id'];
            } else if (params['root']) {
                this.dir = params['root'];
                // this.storageService.setRootDir(params['root']);
            }

            this.ngInit();
            console.log('dd', this.storageService.rootDir);
        });
    }

    public ngOnInit() {
        console.log('onInit');
        // this.storageService.breadcrumbs = [];
        // if (this.dir === 'my-storage') {
        //     this.storageService.breadcrumbs.push(this.storageService.root.base);
        // } else if (this.dir === 'shared-with-me') {
        //     this.storageService.breadcrumbs.push(this.storageService.root.share);
        // } else {
        //     this.storageService.getParents(this.dir);
        // }
    }
    public ngInit() {
        // this.storageService.breadcrumbs = [];
        let dir = this.dir;
        if (dir === 'my-storage') {
            // this.storageService.breadcrumbs.push(this.storageService.root.base);
            this.storageService.getFiles(this.storageService.root.base.id);
            this.storageService.selectedDir = this.storageService.root.base;
            // this.storageService.breadcrumbs = [this.storageService.selectedDir];
            this.storageService.rootDir = 'my-storage';
            // this.breadcrumbs = [];
        } else if (dir === 'shared-with-me') {
            this.storageService.getSharedFiles();
            this.storageService.selectedDir = this.storageService.root.share;
            // this.storageService.breadcrumbs = [this.storageService.selectedDir];
            this.storageService.rootDir = 'shared-with-me';
            // this.storageService.breadcrumbs = [this.storageService.selectedDir];
            // this.breadcrumbs = [];
        } else {
            // this.storageService.breadcrumbs = [];

            this.storageService.getFiles(dir);
            // this.storageService.getParents(dir);
            this.storageService.getItemById(dir)
                .subscribe((f) => {
                    this.storageService.selectedDir = f;
                });
            // this.breadcrumbs.push(dir);
            // this.storageService.getFolderInfo(dir);
        }
        this.storageService.getFolderInfo(dir);
        console.log('playlist', this.storageService.playlist);
    }

    /**
     * @param event
     * @returns Subscription
     */
    public isMenuItemDir(item: any): boolean {
        return item.isDir;
    }
    public isMenuItem360(item: any): boolean {
        if (item.metaData) {
            return this.utilService.getFileType(item.metaData.mimeType) === 'video' || this.utilService.getFileType(item.metaData.mimeType) === 'image';
        }
    }
    public isVideoItem(item: any): boolean {
        if (item.metaData) {
            return this.utilService.getFileType(item.metaData.mimeType) === 'video';
        }
    }
    public viewFile(file) {
        console.log('view', file.fullUrl);
        this.fileModel = file;
        this.modalHeader = file.name;
        this.modalRef = this.modal.open(this.modalFileView, {backdrop: 'static', windowClass: 'preview-window'});
    }
    public nextItem() {
        let old = this.fileModel;
        let files = this.storageService.files;
        if (files[files.indexOf(old) + 1]) {
            this.fileModel = files[files.indexOf(old) + 1];
        } else {
            this.fileModel = files[0];
        }
        this.modalRef.close();
        this.viewFile(this.fileModel);
    }
    public prevItem() {
        let old = this.fileModel;
        let files = this.storageService.files;
        if (files[files.indexOf(old) - 1]) {
            this.fileModel = files[files.indexOf(old) - 1];
        } else {
            this.fileModel = files[files.length - 1];
        }
        this.modalRef.close();
        this.viewFile(this.fileModel);
    }
    public deletePermission(contact: any) {
        contact.role = 'restrict';
        console.log(this.contacts);
    }
    public getPermissions(item) {
        this.itemOwners = [];
        item.permissions.forEach((user) => {
            if (user.role !== 'owner') {
                this.currentContacts.push(user);
            } else {
                this.itemOwners.push(user);
            }
        });
    }
    public setPrivacy(event) {
        this.privacySwitch = event;
        this.storageService.setPublic(this.shareModel, event)
            .subscribe((res) => {
                this.shareModel.isPublic = res.isPublic;
                // this.storageService.files.forEach((f) => {
                //     if (f.id === res.id) {
                //         f.isPublic = res.isPublic;
                //     }
                // });
                console.log('rr', res);
                // this.shareModel = null;
            });
    }
    public goBack() {
        this.modalHeader = 'Share with others';
        this.isAdvanced = !this.isAdvanced;
    }
    public goAdvanced() {
        this.contacts.forEach((user) => {
            if (!user.role) {
                user.role = this.selectedRole;
            }
        });
        this.allContacts = this.currentContacts.concat(this.contacts, this.itemOwners);
        this.modalHeader = 'Sharing settings';
        this.isAdvanced = true;
    }
    /**
     * @param item
     * @returns share modal
     */
    public openShareModal(item) {
        this.storageService.getPermissions(item.id)
            .subscribe((pers) => {
                item.permissions = [];
                pers.forEach((p) => {
                    item.permissions.push(p);
                });
                this.getPermissions(item);
            });
        this.currentContacts = [];
        this.isAdvanced = false;
        this.contacts = [];
        this.filteredContactsMultiple = [];
        this.modalHeader = 'Share with others';
        this.shareModel = item;
        this.modalRef = this.modal.open(this.modalShare, {backdrop: 'static'});
    }
    /**
     * @param item
     * @returns open embed modal
     */
    public itemEmbedModal(item) {
        this.shareModel = item;
        this.privacySwitch = item.isPublic;
        this.itemModel = `<iframe src="${this.storageService.siteUrl}/app/embed/${item.id}/900X500" style="border:0px #ffffff none;" name="myiFrame" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="500px" width="900px" allowfullscreen></iframe>`;
        console.log(item);
        this.modalRef = this.modal.open(this.modalEmbed);
    }
    /**
     * @param item
     * @returns open share link modal
     */
    public shareLinkModal(item) {
        this.shareModel = item;
        this.privacySwitch = item.isPublic;
        // this.itemModel = `localhost:3000/app/open?id=${item.id}?w=500&h=300`;
        this.itemModel = `${this.storageService.siteUrl}/app/open?id=${item.id}&w=500&h=300`;
        console.log(item);
        this.modalRef = this.modal.open(this.modalShareLink);
    }
    /**
     * @param item
     * @return open rename modal
     */
    public openRenameModal(item) {
        this.itemModel = item;
        if (item.isDir) {
            this.itemModel.name = item.childPath;
        } else {
            let name = item.childPath;
            name = name.replace(/^.*[\\\/]/, '');
            this.itemModel.name = name;
        }
        this.modalRef = this.modal.open(this.modalRename, {size: 'sm', backdrop: 'static'});
    }
    public openModalPlaylist(item: any) {
        this.modalRef = this.modal.open(this.modalPlaylist, {size: 'sm', backdrop: 'static'});
    }
    public saveName() {
        this.storageService.updateItem(this.itemModel)
            .subscribe((folder) => {
                this.storageService.folders.forEach((f) => {
                    if (f.id === folder.id) {
                        f.childPath = folder.childPath;
                    }
                    this.modalRef.close();
                });
            });
    }
    public filterContactMultiple(event) {
        let query = event.query;
        this.userService.getAllUsers(query).subscribe((contacts) => {
            this.filteredContactsMultiple = this.filterContact(event, query, contacts);
        });
    }
    public sendShare() {
        let body: any = {
            permissions: []
        };
        this.contacts.forEach((user) => {
            if (!user.role) {
                user.role = this.selectedRole;
            }
            body.permissions.push({user: user.id, role: user.role});
        });
        console.log(this.contacts);
        console.log(body);
        this.storageService.shareItem(this.shareModel.id, body)
            .subscribe(() => {
                this.modalRef.close();
            });
    }
    private filterContact(event, query, contacts: any[]): any[] {
        let filtered: any[] = [];
        contacts.forEach((contact) => {
            console.log(contact);
            if (contact.email.indexOf(query) > -1) {
                filtered.push(contact);
            }
        });
        return filtered;
    }
}
