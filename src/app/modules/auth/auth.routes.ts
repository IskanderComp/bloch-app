import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
      path: 'auth',
      component: AuthComponent,
      children: [
          {
              path: '',
              redirectTo: 'login',
              pathMatch: 'full'
          },
          {
              path: 'login',
              component: LoginComponent
          },
          {
              path: 'signup',
              component: RegisterComponent
          }
      ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
