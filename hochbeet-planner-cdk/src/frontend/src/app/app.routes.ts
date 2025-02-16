import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'planner', pathMatch: 'full' },
  {
    path: 'planner',
    loadComponent: () =>
      import('./hochbeet-drag-and-drop/hochbeet-drag-and-drop.component').then(
        (mod) => mod.HochbeetDragAndDropComponent
      )
  },
  {
    path: 'own-plants',
    loadComponent: () =>
      import('./own-plants/own-plants.component').then(
        (mod) => mod.OwnPlantsComponent
      )
  },
  { path: '*', redirectTo: 'planner' }
];
