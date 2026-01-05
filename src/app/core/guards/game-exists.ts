import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const gameExistsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const gameIdFromUrl = route.paramMap.get('id');

  const savedGameData = localStorage.getItem('planning_poker_game');
  const savedGame = savedGameData ? JSON.parse(savedGameData) : null;

  if (savedGame?.id === gameIdFromUrl) {
    return true;
  }

  return router.createUrlTree(['/create']);
};
