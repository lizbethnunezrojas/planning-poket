import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { User } from '../models/user.model';

describe('GameService - Pruebas Integradas (HU4 a HU13)', () => {
  let service: GameService;
  let localStore: Record<string, string> = {};
  let sessionStore: Record<string, string> = {};

  beforeEach(() => {
    localStore = {};
    sessionStore = {};

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
    it('debería cargar exactamente los 5 jugadores mockeados al inicio (AC4)', () => {
      const players = service.players();
      expect(players).toHaveLength(5); 
      expect(players.map((p) => p.name)).toContain('Alonso Q');
      expect(players.map((p) => p.name)).toContain('Andres');
    });

    it('debería añadir un nuevo usuario a la lista (Total: 6 jugadores)', () => {
      service.registerUser('Luis', 'player');
      expect(service.players()).toHaveLength(6);
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

    it('debe transicionar a fase revealed tras 2 segundos si todos votaron', async () => {
      vi.useFakeTimers();
      
      const admin: User = { id: '1', role: 'admin', viewMode: 'player', hasSelectedCard: true } as any;
      (service as any).currentUserSignal.set(admin);
      
      service.revealCards();
      
      expect(service.phase()).toBe('loading');
      await vi.advanceTimersByTimeAsync(2000);
      expect(service.phase()).toBe('revealed');
    });
  });

  describe('Gestión de Roles (HU13)', () => {
    it('debe permitir que Admin y Sub-Admin gestionen el juego', () => {
      (service as any).currentUserSignal.set({ role: 'sub-admin' });
      expect(service.canManageGame()).toBe(true);

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

describe('GameService - HU14: Cambio de Modo de Puntaje', () => {
  let service: GameService;

  beforeEach(() => {
    const localStore: Record<string, string> = {
      'planning_poker_game': JSON.stringify({ id: 'G1', name: 'Test' })
    };
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => localStore[key] || null,
      setItem: (key: string, value: string) => { localStore[key] = value; },
    });

    TestBed.configureTestingModule({ providers: [GameService] });
    service = TestBed.inject(GameService);
  });

  it('debe seleccionar por defecto la primera opción de la lista (AC 5)', () => {
    expect(service.currentModeId()).toBe('fibonacci');
    expect(service.availableCards()).toContain(3);
    expect(service.availableCards()).toContain(89);
  });

  it('solo el administrador debe poder cambiar el modo (AC 1)', () => {
    const player: User = { id: '2', role: 'player' } as any;
    (service as any).currentUserSignal.set(player);

    service.changeScoringMode('tshirt');

    expect(service.currentModeId()).toBe('fibonacci');
  });

  it('solo debe permitir el cambio si la fase es "voting" (AC 3)', () => {
      const admin: User = { id: '1', role: 'admin' } as any;
      (service as any).currentUserSignal.set(admin);
      
      (service as any)._phase.set('revealed'); 

      service.changeScoringMode('powers');

      expect(service.currentModeId()).toBe('fibonacci');
    });

it('debe cambiar las cartas disponibles al elegir un nuevo modo (AC 2, AC 6)', () => {
  const admin: User = { id: '1', role: 'admin' } as any;
  (service as any).currentUserSignal.set(admin);

  service.changeScoringMode('powers'); 

  expect(service.currentModeId()).toBe('powers');
  expect(service.availableCards()).toContain(64); 
  expect(service.availableCards()).not.toContain(89); 
});

  it('debe resetear la votación de todos los jugadores al cambiar el modo (AC 4)', () => {
    const admin: User = { id: '1', role: 'admin' } as any;
    const player: User = { id: '2', name: 'Alonso', selectedCard: '8', hasSelectedCard: true } as any;
    
    (service as any).currentUserSignal.set(admin);
    (service as any)._players.set([admin, player]);

    service.changeScoringMode('powers');

    const updatedPlayer = service.players().find(p => p.name === 'Alonso');
    expect(updatedPlayer?.selectedCard).toBeNull();
    expect(updatedPlayer?.hasSelectedCard).toBe(false);
  });
});
