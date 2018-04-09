import { Routes } from '@angular/router';

import { IsLoggedGuard } from './providers/AuthService/Guards/isLoggedGuard';
import { MainComponent } from './modules/main/main.component';
import { AuthComponent } from './modules/auth/auth.component';

export const ROUTES: Routes = [
  {
      path: '',
      component: MainComponent,
      // canActivate: [IsLoggedGuard]
  },
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
  },
];
