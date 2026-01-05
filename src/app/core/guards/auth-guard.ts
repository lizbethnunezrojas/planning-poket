import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const authGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  const gameIdFromUrl = route.params['id'];
  const currentUser = gameService.currentUser();

  const userGameId = currentUser?.gameId?.trim();

  if (currentUser && userGameId === gameIdFromUrl) {
    return true;
  }

  if (gameIdFromUrl) {
    return router.createUrlTree(['/join', gameIdFromUrl]);
  }

  return router.createUrlTree(['/create']);
};
