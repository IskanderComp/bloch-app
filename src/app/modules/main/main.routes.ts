import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { IsLoggedGuard } from '../../providers/AuthService/Guards/isLoggedGuard';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        // canActivate: [IsLoggedGuard]
    }

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
