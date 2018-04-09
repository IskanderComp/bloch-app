import {
    Component, ElementRef, OnInit, Input, ViewEncapsulation, OnDestroy, Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { VgAPI } from 'videogular2/core';

export interface Option {
    name: string;
    quality: number;
    selected: boolean;
}

@Component({
    selector: 'vg-quality',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="container">
            <div class="quality-selected">
                {{ qualitySelected || 'Auto' }}
            </div>

            <select class="qualitySelector" (change)="selectQuality($event.target.value)">
                <option style="background-color: transparent; color: #333;"
                        *ngFor="let q of qualities"
                        [value]="q.name"
                        [selected]="q.selected === true">
                    {{ q.name }}
                </option>
            </select>
        </div>
    `,
    styles: [ `
        vg-quality {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            display: flex;
            justify-content: center;
            width: 50px;
            height: 50px;
            cursor: pointer;
            color: white;
            line-height: 50px;
        }
        vg-quality .container {
            position: relative;
            display: flex;
            flex-grow: 1;
            align-items: center;

            padding: 0;
            margin: 5px;
        }
        vg-quality select.qualitySelector {
            width: 50px;
            padding: 5px 8px;
            border: none;
            background: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            color: transparent;
            font-size: 14px;
        }
        vg-quality select.qualitySelector:focus {
            outline: none;
        }
        vg-quality .quality-selected {
            position: absolute;
            width: 100%;
            height: 50px;
            top: -6px;
            text-align: center;
            text-transform: capitalize;
            font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
            padding-top: 2px;
            pointer-events: none;
        }
        vg-quality .vg-icon-closed_caption:before {
            width: 100%;
        }
    ` ]
})
export class VgQualityComponent implements OnInit, OnDestroy {
    @Input()
    public vgFor: string;
    @Input()
    public qualitySources: Option[];
    @Input()
    public defaultQuality: number;
    @Output()
    public select: EventEmitter<any> = new EventEmitter();

    public elem: HTMLElement;
    public target: any;
    public qualities: Option[];
    public qualitySelected: string;

    public subscriptions: Subscription[] = [];

    constructor(ref: ElementRef, public API: VgAPI) {
        this.elem = ref.nativeElement;
    }

    public ngOnInit() {
        if (this.API.isPlayerReady) {
            this.onPlayerReady();
        } else {
            this.subscriptions.push(this.API.playerReadyEvent.subscribe(() => this.onPlayerReady()));
        }
    }

    public onPlayerReady() {
        this.target = this.API.getMediaById(this.vgFor);

        // const subs: Option[] = Array.from(this.qualitySources)
        //     .map((item: any) => ({
        //         name: item.name,
        //         selected: item.selected,
        //         sources: item.sources
        //     }));

        this.qualities = [
            ...this.qualitySources
        ];

        this.qualitySelected = this.qualities.filter((item: Option) => item.selected === true)[0].name;
    }

    public selectQuality(qId: any) {
        this.select.emit(qId);
        this.qualitySelected = (qId === 'null') ? null : qId;
        //
        // Array.from((this.API.getMasterMedia().elem as HTMLMediaElement).textTracks)
        //     .forEach((item: TextTrack) => {
        //         if (item.language === trackId) {
        //             item.mode = 'showing';
        //         } else {
        //             item.mode = 'hidden';
        //         }
        //     });
    }

    public ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
