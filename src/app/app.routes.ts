import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'secure', pathMatch: 'full' },
  {
    path: 'secure',
    loadComponent: () =>
      import('./secure/secure.component').then((mod) => mod.SecureComponent)
  }
];
