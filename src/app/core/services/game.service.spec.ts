import { TestBed} from '@angular/core/testing';
import { GameService } from './game.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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

describe('GameService - HU5: Revelar Cartas', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('debe calcular el promedio con 2 decimales ignorando espectadores', () => {
    // Forzar un estado de jugadores para la prueba
    const mockPlayers: any[] = [
      { id: '1', viewMode: 'player', selectedCard: '5' },
      { id: '2', viewMode: 'player', selectedCard: '13' },
      { id: '3', viewMode: 'spectator', selectedCard: '21' } // Debe ser ignorado
    ];
    
    // Acceder a la señal privada para el test
    (service as any)._players.set(mockPlayers);

    // (5 + 13) / 2 = 9.00
    expect(service.averageScore()).toBe('9.00');
  });

it('debe transicionar por las fases: voting -> loading -> revealed', () => {
  vi.useFakeTimers();
  
  // Verificar estado inicial
  expect(service.phase()).toBe('voting');
  
  // Ejecutamr la acción
  service.revealCards();
  expect(service.phase()).toBe('loading');
  
  // Adelantar el tiempo manualmente 800ms
  vi.advanceTimersByTime(800);
  expect(service.phase()).toBe('revealed');
  
  // Limpiar los timers para otros tests
  vi.useRealTimers();
});

  it('debe generar el resumen de votos correctamente (Criterio 4)', () => {
    const mockPlayers: any[] = [
      { id: '1', viewMode: 'player', selectedCard: '8' },
      { id: '2', viewMode: 'player', selectedCard: '8' },
      { id: '3', viewMode: 'player', selectedCard: '3' }
    ];
    (service as any)._players.set(mockPlayers);

    const summary = service.summaryVotes();
    
    expect(summary).toContainEqual({ value: '8', count: 2 });
    expect(summary).toContainEqual({ value: '3', count: 1 });
    // Verificar orden ascendente (3 antes que 8)
    expect(summary[0].value).toBe('3');
  });
});