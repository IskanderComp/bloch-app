import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './file-view.routes';
import { FileViewComponent } from './file-view.component';
import { FileViewService } from './file-view.service';
import { FileComponent } from './file.component';
import { GrowlModule, MessagesModule } from 'primeng/primeng';
import { VrPlayerModule } from '../storage/vr-player/vr-player.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GrowlModule,
        MessagesModule,
        routing,
        VrPlayerModule
    ],
    declarations: [
        FileViewComponent,
        FileComponent,
    ],
    providers: [
        FileViewService
    ],
    exports: []
})
export class FileViewModule {}
