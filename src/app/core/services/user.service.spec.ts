import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from './user.service';
import { TestBed } from '@angular/core/testing';

describe('UserService - Validación HU08', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    localStorage.clear();
  });

  it('debería guardar a un invitado con el rol "player" (Criterio 3)', () => {
    service.saveUser({
      name: 'Alexa',
      viewMode: 'player',
      gameId: 'XWARXH4',
      role: 'player' 
    });

    const user = service.getCurrentUser();
    expect(user?.name).toBe('Alexa');
    expect(user?.role).toBe('player');
    expect(user?.gameId).toBe('XWARXH4');
  });
});