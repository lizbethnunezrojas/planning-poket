import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', 
    loadComponent: () => import('./features/pages/create-game-page/create-game-page').then(m => m.CreateGamePage),
    title: 'Crear Partida - Planning Poker',
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];