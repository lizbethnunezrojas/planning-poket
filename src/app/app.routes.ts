import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

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
    path: 'join/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pages/join-game/join-game-page').then((m) => m.JoinGamePage),
  },

  {
    path: 'game/:id',
    loadComponent: () =>
      import('./features/pages/game-board/game-board-page').then((m) => m.GameBoardPage),
  },
];
