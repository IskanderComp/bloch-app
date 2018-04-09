import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileViewComponent } from './file-view.component';
import { IsLoggedGuard } from '../../../providers/AuthService/Guards/isLoggedGuard';
import { FileComponent } from './file.component';

const routes: Routes = [
    {
        path: 'open',
        component: FileComponent
    },
    {
        path: 'file',
        // canActivate: [IsLoggedGuard],
        children: [
            {
                path: ':id/:size',
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full'
                    },
                    {
                        path: 'view',
                        component: FileViewComponent,
                    },
                    {
                        path: 'edit',
                        component: FileViewComponent,
                    }
                ]
            }
        ]
    },
    {
        path: 'embed',
        children: [
            {
                path: ':id/:size',
                component: FileViewComponent
            }
        ]
    }

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
