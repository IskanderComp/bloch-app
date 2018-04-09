import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { VgAPI, VgEvents, VgMedia } from 'videogular2/core';
import { UtilService } from '../../../../providers/util.service';
@Component({
    selector: 'vr-player',
    templateUrl: './vr-playar.component.html',
    styles: [`
        vr-player {
        }
        /*vg-player {*/
            /*width: calc(100% - 250px);*/
            /*float: left;*/
        /*}*/
        ul {
            border-left: 2px solid green;
            background-color:#222;
            list-style-type: none;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            width: 250px; 
            height: 100%; 
            float: right; 
        }

        ul li {
            padding: 10px;
            cursor: pointer;
            color:#fff;
        }
        ul li.active {
            background-color: #dddddd;
            color: #333;
        }

        ul li:hover {
            background-color: #cce6ee;
            color: #333;
        }
    `]
})
export class VrPlayerComponent implements OnInit, OnDestroy {
    public qualitySources: any[] = [];
    public api: VgAPI;
    public elem;
    public defaultQuality: number;
    @Input()
    public item: any;
    @Input()
    public size = {
        width:  null,
        height: null
    };
    public currentTime: number = 0;
    public itemSrc: string;
    public video;
    public isVideo: boolean = false;
    public is360: boolean = false;
    constructor(
        private utilService: UtilService,
        private ref: ElementRef) {
        this.elem = ref.nativeElement;
    }

    public onPlayerReady(api: VgAPI) {
        console.log('vgApi', api);
        this.api = api;
        this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe((e) => {
            if (this.api.canPlayThrough) {
                this.api.seekTime(this.currentTime, true);
            }
            this.play();
        });
        this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe((e) => {
            // console.log('canPlayThrough', this.api.canPlayThrough);
            // if (this.api.canPlayThrough) {
            //     this.api.seekTime(this.currentTime, true);
            // }
            // this.play();
            // this.currentTime = this.api.currentTime;
            // console.log('timeUpdate ct', this.currentTime);
            // console.log('timeUpdate', e);

        });
        this.api.getDefaultMedia().subscriptions.loadedData.subscribe((e) => {
            console.log('canPlayThrough', this.api.canPlayThrough);
            if (this.api.canPlayThrough) {
                // this.api.seekTime(this.currentTime, true);
            }
            // this.play();
            console.log('load data e', e);

        });
        this.api.getDefaultMedia().subscriptions.rateChange.subscribe((d) => {
            console.log('rate', d.target.playbackRate);
        });

        console.log('medias', this.api.medias);
        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
        // this.api.registerMedia();
        console.log('ended', this.api.getDefaultMedia().subscriptions.ended);
    }
    public error(event) {
        console.log('error', event);
    }
    public abort(event) {
        console.log('abort', event);
    }
    public selectQuality(event) {
        this.qualitySources.forEach((q) => {
            this.currentTime = this.api.getDefaultMedia().currentTime;
            if (q.name === event) {
                this.itemSrc = this.utilService.getVideo(this.item.fullUrl, q.quality);
                // this.itemSrc = this.itemSrc.replace(/\?q=(.*)/, q.quality);
                this.currentTime = this.api.currentTime;
                this.play();
            }
        });
    }
    public play() {
        console.log(this.api.isCompleted);
        // this.api.getDefaultMedia().currentTime = this.currentTime;
        this.api.play();
    }
    public staled(event) {
        console.log('staled', event);
    }
    public onvolumechange(event) {
        console.log('voliume', event);
    }
    public pause() {
        console.log('pause');
        console.log('ctime', this.api.currentTime);
    }
    public playing() {
        console.log('playing');
    }
    public progress(event) {
        // this.elem.dispatchEvent(new CustomEvent(VgEvents.VG_ABORT));
        // console.log(event);
        // console.log('progress');
    }
    public seeked(event) {
        console.log('seeked', event);
    }
    public loadeddata(event) {
        console.log('loadeddata', event);
    }
    public seeking(event) {
        console.log('seeking', event);
    }
    public  onClickPlaylistItem(item: any, index: number) {
        // this.currentIndex = index;
        this.item = item;
        console.log('item', this.item);
        this.getExt(this.item);
        this.is360 = this.item.metaData.is360;

        if (this.item.metaData.quality) {
            this.item.metaData.quality.forEach((q) => {
                this.qualitySources.push({
                    name: `${q}p`,
                    quality: q,
                    selected: false
                });
            });
            this.qualitySources.push({
                name: 'Auto',
                quality: this.defaultQuality,
                selected: true
            });
        }
    }
    public ngOnInit() {
        // this.elem.style('width', this.size.width);
        if (this.size.width && this.size.height) {
            this.elem.style.width = this.size.width + 'px';
            this.elem.style.height = this.size.height + 'px';
            this.elem.style.marginLeft = - this.size.width / 2 + 'px';
            this.elem.style.marginTop = - this.size.height / 2 + 'px';
            this.elem.style.top = 50 + '%';
            this.elem.style.left = 50 + '%';
            this.elem.style.position = 'absolute';
        }
        console.log('item', this.item);
        this.is360 = this.item.metaData.is360;

        if (this.item.metaData.quality && this.item.metaData.quality.length) {
            this.item.metaData.quality.sort().reverse();
            this.defaultQuality = this.utilService.getMaxValue(this.item.metaData.quality);
            this.item.metaData.quality.forEach((q) => {
                this.qualitySources.push({
                    name: `${q}p`,
                    quality: q,
                    selected: false
                });
            });
            this.qualitySources.push({
                name: 'Auto',
                // quality: this.defaultQuality,
                selected: true
            });
        }
        this.getExt(this.item);
    }
    public ngOnDestroy() {
        console.log('destroy');
    }
    private getExt(file) {
        console.log('sss', this.utilService.getFileType(file.metaData.mimeType));
        if (this.utilService.getFileType(file.metaData.mimeType) === 'video') {
            this.isVideo = true;
            this.itemSrc = this.utilService.getVideo(this.item.fullUrl);
        } else if (this.utilService.getFileType(file.metaData.mimeType) === 'image') {
            this.isVideo = false;
            this.itemSrc = this.item.fullUrl;
        }
    }
}
