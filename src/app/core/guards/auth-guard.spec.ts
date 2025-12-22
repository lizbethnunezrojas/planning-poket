import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { GameService } from '../services/game.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('authGuard - Protección de Rutas', () => {
  const mockCurrentGame = signal<any>(null);
  const mockCurrentUser = signal<any>(null);

  const mockRouter = {
    parseUrl: vi.fn((url: string) => url as any),
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

  // Helper para simular los parámetros de la URL
  const runGuard = (params: any = {}) => {
    const route = { params } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(route, {} as any));
  };

  it('debería permitir el acceso si el ID del juego coincide y hay un usuario (Éxito)', () => {
    const gameId = 'game-123';
    mockCurrentGame.set({ id: gameId });
    mockCurrentUser.set({ name: 'Alonso' });

    const result = runGuard({ id: gameId });

    expect(result).toBe(true);
  });

  it('debería redirigir a /join/:id si el juego no coincide pero hay un ID en la URL', () => {
    mockCurrentGame.set(null);
    mockCurrentUser.set(null);

    const result = runGuard({ id: 'abc-456' });

    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/join/abc-456');
    expect(result).toBe('/join/abc-456');
  });

  it('debería redirigir a /create si no hay ID de juego en la URL ni juego activo', () => {
    mockCurrentGame.set(null);
    mockCurrentUser.set(null);

    const result = runGuard({}); // Sin params

    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/create');
    expect(result).toBe('/create');
  });
});