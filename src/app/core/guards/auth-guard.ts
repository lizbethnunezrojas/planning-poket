import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const authGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  const gameIdFromUrl = route.params['id'];
  const currentGame = gameService.currentGame();
  const currentUser = gameService.currentUser();

  if (currentGame?.id === gameIdFromUrl && currentUser) {
    return true;
  }

  if (gameIdFromUrl) {
    return router.parseUrl(`/join/${gameIdFromUrl}`);
  }

  return router.parseUrl('/create');
};
