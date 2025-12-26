import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';

export const authGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  const gameIdFromUrl = route.paramMap.get('id')?.trim();
  const currentUser = gameService.currentUser();

  const userGameId = currentUser?.gameId?.trim();

  console.log(`Comparando: [${userGameId}] === [${gameIdFromUrl}]`);

  if (currentUser && userGameId === gameIdFromUrl) {
    return true;
  }

  if (gameIdFromUrl) {
    return router.parseUrl(`/join/${gameIdFromUrl}`);
  }

  return router.parseUrl('/create');
};
