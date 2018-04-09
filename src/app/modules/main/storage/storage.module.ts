import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgUploaderModule } from 'ngx-uploader';

import { routing } from './storage.routes';
import { StorageComponent } from './storage.component';
import {
    StorageFileCardComponent
} from './storage-file-card/storage-file-card.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from './storage.service';
import { StorageViewComponent } from './storage-view/storage-vew.component';
import { ContextMenuModule } from 'ngx-contextmenu';

// primeng modules
import { AutoCompleteModule, InputSwitchModule, GrowlModule } from 'primeng/primeng';

// Videogular
import { VrPlayerModule } from './vr-player/vr-player.module';

// import { Aframe } from 'aframe';

@NgModule({
    imports: [
        CommonModule,
        NgUploaderModule,
        FormsModule,
        ContextMenuModule,
        AutoCompleteModule,
        GrowlModule,
        InputSwitchModule,
        routing,
        VrPlayerModule
    ],
    declarations: [
        StorageComponent,
        StorageFileCardComponent,
        StorageViewComponent,
        // VRPlayerComponent,
        // VgQualityComponent
    ],
    providers: [
        StorageService,
    ],
    exports: []
})
export class StorageModule {}
