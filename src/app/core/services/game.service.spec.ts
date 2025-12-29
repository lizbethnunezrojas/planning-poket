import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { User } from '../models/user.model';

describe('GameService - Pruebas Integradas (HU4 a HU13)', () => {
  let service: GameService;
  let localStore: Record<string, string> = {};
  let sessionStore: Record<string, string> = {};

  beforeEach(() => {
    // Reiniciar almacenes ficticios
    localStore = {};
    sessionStore = {};

    // Mock centralizado de Storage
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => localStore[key] || null,
      setItem: (key: string, value: string) => {
        localStore[key] = value;
      },
      removeItem: (key: string) => {
        delete localStore[key];
      },
      clear: () => {
        localStore = {};
      },
    });

    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => sessionStore[key] || null,
      setItem: (key: string, value: string) => {
        sessionStore[key] = value;
      },
      removeItem: (key: string) => {
        delete sessionStore[key];
      },
    });

    // HIDRATACIÓN
    localStore['planning_poker_game'] = JSON.stringify({ id: 'GAME-123', name: 'Sprint Test' });

    TestBed.configureTestingModule({
      providers: [GameService],
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ESTADO INICIAL Y REGISTRO
  describe('Estado Inicial y Registro', () => {
    it('debería cargar exactamente los 2 jugadores mockeados al inicio (AC4)', () => {
      const players = service.players();
      expect(players).toHaveLength(2); // Alonso y Micaela
      expect(players.map((p) => p.name)).toContain('Alonso Q');
    });

    it('debería añadir un nuevo usuario a la lista (Total: 3 jugadores)', () => {
      service.registerUser('Luis', 'player');
      expect(service.players()).toHaveLength(3);
    });

    it('debería mantener el ID al cambiar de modo (HU12)', () => {
      service.registerUser('Eli', 'player');
      const id = service.currentUser()?.id;
      service.registerUser('Eli', 'spectator');
      expect(service.currentUser()?.id).toBe(id);
    });
  });

  // LÓGICA DE VOTACIÓN Y CÁLCULOS
  describe('Votación y Resultados', () => {
    it('debe calcular el promedio con 1 decimal excluyendo espectadores', () => {
      const mockPlayers: User[] = [
        {
          id: '1',
          name: 'P1',
          role: 'admin',
          viewMode: 'player',
          selectedCard: '5',
          hasSelectedCard: true,
          gameId: 'G1',
        },
        {
          id: '2',
          name: 'P2',
          role: 'player',
          viewMode: 'player',
          selectedCard: '13',
          hasSelectedCard: true,
          gameId: 'G1',
        },
        {
          id: '3',
          name: 'E1',
          role: 'player',
          viewMode: 'spectator',
          selectedCard: '21',
          hasSelectedCard: true,
          gameId: 'G1',
        },
      ];
      (service as any)._players.set(mockPlayers);
      expect(service.averageScore()).toBe('9.0');
    });

    it('debe transicionar a fase revealed tras 2 segundos', async () => {
      vi.useFakeTimers();
      service.revealCards();
      expect(service.phase()).toBe('loading');
      await vi.advanceTimersByTimeAsync(2000);
      expect(service.phase()).toBe('revealed');
    });
  });

  // ROLES Y PERMISOS HU13
  describe('Gestión de Roles (HU13)', () => {
    it('debe permitir que Admin y Sub-Admin gestionen el juego', () => {
      // Caso Sub-Admin
      (service as any).currentUserSignal.set({ role: 'sub-admin' });
      expect(service.canManageGame()).toBe(true);

      // Caso Player
      (service as any).currentUserSignal.set({ role: 'player' });
      expect(service.canManageGame()).toBe(false);
    });

    it('debe limpiar votos al reiniciar partida si tiene permisos', () => {
      (service as any).currentUserSignal.set({ role: 'admin' });
      (service as any)._players.set([{ id: '1', selectedCard: '8', hasSelectedCard: true }]);

      service.resetGame();

      expect(service.phase()).toBe('voting');
      expect(service.players()[0].selectedCard).toBeNull();
    });

    it('debe permitir promover a un jugador a sub-admin', () => {
      const admin: User = { id: '1', name: 'Admin', role: 'admin' } as any;
      const player: User = { id: '2', name: 'Player', role: 'player' } as any;

      (service as any).currentUserSignal.set(admin);
      (service as any)._players.set([admin, player]);

      service.toggleSubAdmin('2');
      expect(service.players()[1].role).toBe('sub-admin');
    });
  });
});
