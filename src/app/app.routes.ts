import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'sbb', loadComponent: () => import('./sbb/sbb').then((m) => m.Sbb) },
  { path: '**', redirectTo: '' },
];
