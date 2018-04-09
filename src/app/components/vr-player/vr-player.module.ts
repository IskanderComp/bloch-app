import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VrPlayerComponent } from './vr-player.component';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VrPlayerService } from './vr-player.service';
import { VgQualityComponent } from '../vg-quality/vg-quality.component';

@NgModule({
    imports: [
        CommonModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
    ],
    declarations: [
        VrPlayerComponent,
        VgQualityComponent
    ],
    providers: [
        VrPlayerService
    ],
    exports: [
        VrPlayerComponent
    ]
})
export class VrPlayerModule {}
