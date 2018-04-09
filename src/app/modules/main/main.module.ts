import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './main.routes';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SwapIconDirective } from '../../directives/swap-icon.directive';

import { MainComponent } from './main.component';
import { StorageModule } from './storage';
import { IsLoggedGuard } from '../../providers/AuthService/Guards/isLoggedGuard';
import { FileViewModule } from './file-view/file-view.module';

@NgModule({
    imports: [
        CommonModule,
        StorageModule,
        FileViewModule,
        routing,

    ],
    declarations: [
        MainComponent,
        NavbarComponent,
        SwapIconDirective,
    ],
    providers: [
        IsLoggedGuard
    ],
    exports: [MainComponent]
})

export class MainModule {}
