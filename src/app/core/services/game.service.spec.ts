import { TestBed} from '@angular/core/testing';
import { GameService } from './game.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { User } from '../models/user.model';

describe('GameService - HU4: Lógica de Estado y Jugadores', () => {
  let service: GameService;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    TestBed.configureTestingModule({
      providers: [GameService],
    });
    service = TestBed.inject(GameService);
  });

  describe('Inicialización y Cartas (AC3, AC4)', () => {
    it('debería garantizar que el mazo dinámico no contenga duplicados (AC3)', () => {
      const cards = service.availableCards();
      const uniqueCards = new Set(cards);

      expect(cards.length).toBeGreaterThan(0);
      expect(uniqueCards.size).toBe(cards.length);
    });

    it('debería cargar exactamente los jugadores mockeados obligatorios al inicio', () => {
      const players = service.players();
      const mockNames = players.map((p) => p.name);

      expect(players).toHaveLength(2);
      expect(mockNames).toContain('Alonso Q');
      expect(mockNames).toContain('Micaela R');
    });
  });

  describe('Registro y Selección (AC5)', () => {
    it('debería añadir un nuevo usuario a la lista de jugadores al registrarse', () => {
      service.createGame('Sprint 1');

      service.registerUser('Luis', 'player');

      const players = service.players();
      expect(players.some((p) => p.name === 'Luis')).toBe(true);
      expect(players).toHaveLength(3);
    });

    it('debería actualizar el estado de la carta del jugador en la lista global (AC5)', () => {
      service.createGame('Sprint 1');
      service.registerUser('Luis', 'player');
      const luisId = service.currentUser()?.id;

      service.selectCard(8);

      const luisInList = service.players().find((p) => p.id === luisId);
      expect(luisInList?.selectedCard).toBe('8');
      expect(luisInList?.hasSelectedCard).toBe(true);
    });
  });
});
// ----------------------------------------------------------------------------
describe('GameService - HU5: Revelar Cartas', () => {
  let service: GameService;

  beforeEach(() => {
    vi.useFakeTimers(); 
    TestBed.configureTestingModule({
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('debe calcular el promedio con 1 decimal excluyendo espectadores (Criterio 5)', () => {
    const mockPlayers: User[] = [
      { id: '1', name: 'P1', role: 'admin', viewMode: 'player', selectedCard: '5', hasSelectedCard: true, gameId: 'g1' },
      { id: '2', name: 'P2', role: 'player', viewMode: 'player', selectedCard: '13', hasSelectedCard: true, gameId: 'g1' },
      { id: '3', name: 'E1', role: 'player', viewMode: 'spectator', selectedCard: '21', hasSelectedCard: true, gameId: 'g1' }
    ];

    (service as any)._players.set(mockPlayers);

    expect(service.averageScore()).toBe('9.0');
  });

  it('debe contar correctamente la cantidad de personas por cada carta (Criterio 4)', () => {
    const mockPlayers: User[] = [
      { id: '1', name: 'P1', role: 'admin', viewMode: 'player', selectedCard: '8', hasSelectedCard: true, gameId: 'g1' },
      { id: '2', name: 'P2', role: 'player', viewMode: 'player', selectedCard: '8', hasSelectedCard: true, gameId: 'g1' },
      { id: '3', name: 'P3', role: 'player', viewMode: 'player', selectedCard: '3', hasSelectedCard: true, gameId: 'g1' }
    ];
    (service as any)._players.set(mockPlayers);

    const summary = service.summaryVotes();
    
    expect(summary).toContainEqual({ value: '8', count: 2 });
    expect(summary).toContainEqual({ value: '3', count: 1 });
  });

  it('debe identificar correctamente si el usuario tiene rol administrador (Criterio 1)', () => {
    const adminUser: User = { id: '1', name: 'Admin', role: 'admin', viewMode: 'player', selectedCard: null, hasSelectedCard: false, gameId: 'g1' };
    
    (service as any).currentUserSignal.set(adminUser);
    expect(service.isAdmin()).toBe(true);

    const playerUser: User = { ...adminUser, role: 'player' };
    (service as any).currentUserSignal.set(playerUser);
    expect(service.isAdmin()).toBe(false);
  });

  it('debe transicionar a fase revealed tras el tiempo de carga', async () => {
    service.revealCards();
    expect(service.phase()).toBe('loading');
    
    await vi.advanceTimersByTimeAsync(2000); 
    
    expect(service.phase()).toBe('revealed');
  });
});

// ----------------------------------------------------------------------------

describe('GameService - HU6: Reiniciar Partida', () => {
  let service: GameService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
    
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe resetear la fase y limpiar votos si el usuario es admin (Criterios 1 y 2)', () => {
    const adminUser: User = { id: '1', name: 'Admin', role: 'admin', viewMode: 'player', selectedCard: '8', hasSelectedCard: true, gameId: 'g1' };
    const playerUser: User = { id: '2', name: 'Luis', role: 'player', viewMode: 'player', selectedCard: '5', hasSelectedCard: true, gameId: 'g1' };
    
    (service as any).currentUserSignal.set(adminUser);
    (service as any)._players.set([adminUser, playerUser]);
    (service as any)._phase.set('revealed');

    service.resetGame();

    expect(service.phase()).toBe('voting');
    service.players().forEach(player => {
      expect(player.selectedCard).toBeNull();
      expect(player.hasSelectedCard).toBe(false);
    });
  });

  it('NO debe resetear la partida si el usuario no es admin (Criterio 1)', () => {
    const playerUser: User = { id: '2', name: 'Luis', role: 'player', viewMode: 'player', selectedCard: '5', hasSelectedCard: true, gameId: 'g1' };
    
    (service as any).currentUserSignal.set(playerUser);
    (service as any)._phase.set('revealed');

    service.resetGame();

    expect(service.phase()).toBe('revealed');
  });
});
