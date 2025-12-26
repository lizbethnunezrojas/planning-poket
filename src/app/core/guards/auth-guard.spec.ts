import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { authGuard } from './auth-guard';
import { GameService } from '../services/game.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('authGuard - Protección de Rutas', () => {
  const mockCurrentGame = signal<any>(null);
  const mockCurrentUser = signal<any>(null);

  const mockRouter = {
    parseUrl: vi.fn((url: string) => ({
      toString: () => url
    } as UrlTree)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { 
          provide: GameService, 
          useValue: { 
            currentGame: mockCurrentGame,
            currentUser: mockCurrentUser 
          } 
        }
      ]
    });
  });

  const runGuard = (params: any = {}) => {
    const route = { 
      params,
      paramMap: convertToParamMap(params) 
    } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(route, {} as any));
  };

  it('debería permitir el acceso si el ID del juego coincide y hay un usuario (Éxito)', () => {
    const gameId = 'IU1QPU2';
    mockCurrentGame.set({ id: gameId });
    mockCurrentUser.set({ name: 'Alonso', gameId: gameId });

    const result = runGuard({ id: gameId });

    expect(result).toBe(true);
  });

it('debería redirigir a /join/:id si el juego no coincide pero hay un ID en la URL', () => {
  const targetId = 'abc-456';
  mockCurrentGame.set(null);
  mockCurrentUser.set(null);

  const result = runGuard({ id: targetId });

  expect(mockRouter.parseUrl).toHaveBeenCalledWith(`/join/${targetId}`);
  
  if (typeof result === 'boolean') {
    throw new TypeError('Se esperaba un objeto de redirección pero se recibió un booleano');
  } else {
    const urlTree = result as UrlTree; 
    expect(urlTree.toString()).toBe(`/join/${targetId}`);
  }
});

it('debería redirigir a /create si no hay ID de juego en la URL ni juego activo', () => {
  mockCurrentGame.set(null);
  mockCurrentUser.set(null);

  const result = runGuard({}); 

  expect(mockRouter.parseUrl).toHaveBeenCalledWith('/create');
  
  if (typeof result === 'boolean') {
    throw new TypeError('Se esperaba un objeto de redirección pero se recibió un booleano');
  } else {
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toBe('/create');
  }
});
});