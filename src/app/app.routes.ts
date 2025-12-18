import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./features/pages/create-game-page/create-game-page').then((m) => m.CreateGamePage),
  },

  { 
    path: 'join', 
    loadComponent: () => import('./features/pages/join-game/join-game.component').then(m => m.JoinGamePage) 
  }
];
