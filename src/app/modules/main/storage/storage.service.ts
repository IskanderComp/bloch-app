import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { configObject } from '../../../providers/config.service';
import { HttpClient } from '../../../providers/RestService/rest.client';
import { Observable } from 'rxjs/Observable';
import { UtilService } from '../../../providers/util.service';

@Injectable()
export class StorageService {
    public storageUrl = configObject.storageUrl;
    public siteUrl = configObject.siteUrl;
    public folders: any[] = [];
    public files: any[] = [];
    public playlist: any[] = [];
    public breadcrumbs: any[] = [];
    public rootDir: string;

    public root: any = {
        base: {
            id: 'aa288070-72ba-4fb4-9023-d8fb361f72a9',
            rootPath: '',
            isDir: true,
            childPath: '/',
            isShared: false
        },
        share: {
            id: 'aa288070-72ba-4fb4-9023-d8fb361f72a9share',
            rootPath: '',
            isDir: true,
            childPath: '/',
            isShared: true
        }
    };

    public selectedDir: any;
    public parents: any[] = [];

    constructor (
        private utilService: UtilService,
        private http: HttpClient) {
        this.selectedDir = this.root.base;
        this.breadcrumbs = [this.selectedDir];
        console.log('service');
        console.log(this.breadcrumbs);
    }

    /**
     * @param id
     * @returns {Observable<R>}
     */
    public getPermissions(id) {
        return this.http.get(`${this.storageUrl}/fs/${id}/permissions`)
            .map((res: Response) => res.json());
    }

    public selectDirItem(dir) {
        this.selectedDir = dir;
        console.log('die', dir);
        let dd: any;
        if (this.breadcrumbs[0].isShared) {
            // this.rootDir = 'shared-with-me';
            if (!dir.isShared) {
                this.breadcrumbs = [this.selectedDir];
            }
        } else {
            // this.rootDir = 'my-storage';
            if (dir.isShared) {
                this.breadcrumbs = [this.selectedDir];
            }
        }
        this.breadcrumbs.forEach((d) => {
            dd = null;

            if (d.id === dir.id) {
                console.log('this.breadcrumbs:', this.breadcrumbs);
                this.breadcrumbs.splice(this.breadcrumbs.indexOf(d) + 1);
                this.getFiles(d.id);
                // return;
            } else {
                dd = dir;
            }
        });
        if (dd) {
            this.breadcrumbs.push(dd);
        }
        this.getFiles(dir.id);
    }
    // set breadcrumbs
    public setRootDir(root) {
        this.rootDir = root;
        this.breadcrumbs = [];
        if (root === 'my-storage') {
            this.breadcrumbs.push(this.root.base);
        } else {
            this.breadcrumbs.push(this.root.share);
        }
    }

    /**
     * @param id
     * @returns {Subscription}
     */
    public getFiles(id: string) {
        return this.http.get(`${this.storageUrl}/fs/folders/${id}`)
            .map((res: Response) => res.json())
            .subscribe((fs) => {
                console.log(fs);
                this.folders = [];
                this.files = [];
                fs.forEach((f: any) => {
                    if (f.isDir) {
                        f.isOwner = this.isOwner(f);
                        this.folders.push(f);
                    } else {
                        f.name = f.childPath.replace(/^.*[\/]/, '');
                        f.icon = this.getAvatarUrl(f);
                        if (this.utilService.getFileType(f.metaData.mimeType) === 'video') {
                            f.fullUrl = `${this.storageUrl}/video/${f.id}/${f.name}`;
                            this.playlist.push(f);
                        } else {
                            f.fullUrl = `${this.storageUrl}/files/${f.id}/${f.name}`;
                        }
                        this.files.push(f);
                    }
                });
            });
    }

    public getSharedFiles() {
        return this.http.get(`${this.storageUrl}/fs/sharing`)
            .map((res: Response) => res.json())
            .subscribe((fs) => {
                this.folders = [];
                this.files = [];
                console.log('fs');
                console.log(fs);

                fs.forEach((f: any) => {
                    if (f.isDir) {
                        this.folders.push(f);

                    } else {
                        f.name = f.childPath.replace(/^.*[\/]/, '');
                        if (this.utilService.getFileType(f.metaData.mimeType) === 'video') {
                            f.fullUrl = `${this.storageUrl}/video/${f.id}/${f.name}`;
                        } else {
                            f.fullUrl = `${this.storageUrl}/files/${f.id}/${f.name}`;
                        }
                        f.icon = this.getAvatarUrl(f);
                        this.files.push(f);
                    }
                });
            });
    }

    /**
     * @param folder
     * @returns {Observable<R>}
     */
    public createFolder(folder) {
        let rootPath: string;

        if (this.selectedDir.rootPath) {
            if (this.selectedDir.rootPath === '/') {
                rootPath = this.selectedDir.rootPath;
            } else {
                rootPath = this.selectedDir.rootPath + '/';
            }
        } else {
            rootPath = '';
        }

        let body = {
            rootPath: `${rootPath + this.selectedDir.childPath}`,
            childPath: `${folder.name}`,
            parent: `${this.selectedDir.id}`
        };
        return this.http.post(`${this.storageUrl}/fs`, body)
            .map((res: Response) => res.json());
    }

    public deleteFile(e, file) {
        e.stopPropagation();

        let fd = file.childPath.split('/');
        let rootPath: string;
        if (file.rootPath !== '/') {
            rootPath = file.rootPath + '/';
        } else {
            rootPath = file.rootPath;
        }

        return this.http.delete(`${this.storageUrl}/fs/file/${file.id}?path=${rootPath}${fd[2]}`)
            .map((res: Response) => res.json())
            .subscribe(() => {
                this.files.splice(this.files.indexOf(file), 1);
            });
    }

    public deleteFolder(e, dir) {
        e.stopPropagation();

        return this.http.delete(`${this.storageUrl}/fs/${dir.id}`)
            .map((res: Response) => res.json())
            .subscribe(() => {
                this.folders.splice(this.folders.indexOf(dir), 1);
            });
    }
    public getFolderInfo(dir) {
        if (dir === 'my-storage') {
            this.breadcrumbs = [this.root.base];
            return;
        } else if (dir === 'shared-with-me') {
            this.breadcrumbs = [this.root.share];
            return;
        } else {
            // this.breadcrumbs = [];
            return this.http.get(`${this.storageUrl}/fs/${dir}`)
                .map((res: Response) => res.json())
                .subscribe((f) => {
                    if (this.isOwner(f)) {
                        this.rootDir = 'my-storage';
                    } else {
                        this.rootDir = 'shared-with-me';
                    }
                    if (this.breadcrumbs) {
                        console.log('getInfo', f);
                        // this.breadcrumbs.push(f);
                        this.selectDirItem(f);
                    } else {
                        this.getParents(f.id);
                        console.log('bred zero');
                    }
                });
        }
    }

    /**
     * @param item (name, id)
     * @returns {Observable<R>}
     */
    public updateItem(item) {
        let body = {
            name: `${item.name}`
        };
        return this.http.put(`${this.storageUrl}/fs/${item.id}`, body)
            .map((res: Response) => res.json());
    }
    /**
     * @param item
     * @returns {Observable<R>}
     */
    public setPublic(item, isPublic) {
        return this.http.patch(`${this.storageUrl}/fs/${item.id}`, {public: `${isPublic}`})
            .map((res: Response) => res.json());
    }

    /**
     * @param item
     * @param is360
     * @returns {Observable<R>}
     */
    public setIs360(item) {
        return this.http.patch(`${this.storageUrl}/fs/${item.id}`, {is360: !item.metaData.is360})
            .map((res: Response) => res.json())
            .subscribe((data) => {
                this.files.forEach((f) => {
                    if (f.id === data.id) {
                        f.metaData.is360 = data.metaData.is360;
                    }
                });
            });
    }
    /**
     * @param id
     * @param users
     * @returns {Observable<R>}
     */
    public shareItem(id, users) {
        return this.http.post(`${this.storageUrl}/fs/${id}/share`, users)
            .map((res: Response) => res.json());
    }
    /**
     * @param id
     * @returns {Observable<R>}
     */
    public getItemById(id) {
        return this.http.get(`${this.storageUrl}/fs/${id}`)
            .map((res: Response) => res.json());
    }
    public getAvatarUrl(file) {
        file.name = file.childPath.replace(/^.*[\/]/, '');
        let type;
        if (file.metaData) {
            type = this.utilService.getFileType(file.metaData.mimeType);
        }
        let extImgLoc = 'assets/img/extensions';
        let img: string;
        let avatar: string;
        file.fullUrl = `${this.storageUrl}/files/${file.id}/${file.name}`;
        switch (type) {
            case 'image':
                img = this.utilService.getFullUrl(this.storageUrl, file, 'sm');
                avatar = null;
                file.fullUrl = this.utilService.getFullUrl(this.storageUrl, file);
                break;
            case 'video':
                img = `${this.storageUrl}/files/${file.id}/${file.name}?c=true&s=sm`;
                avatar = null;
                file.fullUrl = this.utilService.getFullUrl(this.storageUrl, file);
                break;
            case 'text':
                img = null;
                avatar = `${extImgLoc}/word-icon.png`;
                break;
            default:
                img = null;
                avatar = `${extImgLoc}/blank-icon.png`;
                break;
        }
        return { img, avatar };
    }
    public getReport(url) {
        return this.http.get(url)
            .map((res: Response) => res)
            .catch((err: any) => {
                return Observable.of(err);
            })
            .subscribe((data) => {
                this.downloadFile(data);
            });
    }
    public getParents(id) {
        return this.http.get(`${this.storageUrl}/fs/${id}`)
            .map((res: Response) => res.json())
            .subscribe((f) => {
                // this.setRootDir(f);
                this.breadcrumbs.push(f);
                if (f.parent !== this.root.base.id) {
                    this.getParents(f.parent);
                } else {
                    this.rootDir = 'my-storage';
                    this.breadcrumbs.push(this.root.base);
                }
                console.log('par', this.breadcrumbs);
            });
    }

    /**
     * @param item
     * @returns {boolean}
     */
    public isOwner(item: any): boolean {
        let curUser = localStorage.getItem('currentUser');
        let itemOwner = item.userId;
        return curUser === itemOwner;
    }
    private downloadFile(data) {
        let fileName = data.url.replace(/^.*[\/]/, '');
        let blob = new Blob([data._body], { type: `${data}` });
        let url = window.URL.createObjectURL(blob);
        let anchor = document.createElement('a');
        anchor.download = fileName;
        anchor.href = url;
        anchor.click();
    }
}
