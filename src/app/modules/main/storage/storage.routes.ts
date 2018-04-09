import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../main.component';
import { StorageComponent } from './storage.component';
import { IsLoggedGuard } from '../../../providers/AuthService/Guards/isLoggedGuard';
import { StorageViewComponent } from './storage-view/storage-vew.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        // canActivate: [IsLoggedGuard],
        children: [
            {
                path: '',
                redirectTo: 'storage',
                pathMatch: 'full'
            },
            {
                path: 'storage',
                component: StorageComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'my-storage',
                        pathMatch: 'full'
                    },
                    {
                        path: ':root',
                        component: StorageViewComponent,
                    },
                    {
                        path: 'folders/:id',
                        component: StorageViewComponent,
                    },
                ]
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
