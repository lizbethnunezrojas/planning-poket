import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserService - Validación HU08', () => {
  let service: UserService;

  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      clear: () => { store = {}; },
      removeItem: (key: string) => { delete store[key]; }
    };
  })();

  vi.stubGlobal('localStorage', localStorageMock);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    localStorage.clear(); 
  });

  it('debería guardar a un invitado con el rol "player" (Criterio 3)', () => {
    const mockGuest = {
      name: 'Alexa',
      viewMode: 'player' as const,
      gameId: 'XWARXH4',
      role: 'player' as const
    };

    service.saveUser(mockGuest);
    const user = service.getCurrentUser();

    expect(user?.role).toBe('player');
    expect(user?.name).toBe('Alexa');
  });
});