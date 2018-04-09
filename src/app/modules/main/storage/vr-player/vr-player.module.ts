import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Videogular
import { VgControlsModule } from 'videogular2/controls';
import { VgCoreModule } from 'videogular2/core';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgQualityComponent } from '../../../../components/vg-quality/vg-quality.component';
import { UtilService } from '../../../../providers/util.service';
import { VrPlayerComponent } from './vr-playar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
        UtilService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        VrPlayerComponent
    ]
})
export class VrPlayerModule {}
