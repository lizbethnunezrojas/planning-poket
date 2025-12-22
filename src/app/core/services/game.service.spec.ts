import { TestBed } from '@angular/core/testing';
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
      providers: [GameService]
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
      const mockNames = players.map(p => p.name);
      
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
      expect(players.some(p => p.name === 'Luis')).toBe(true);
      expect(players).toHaveLength(3); 
    });

    it('debería actualizar el estado de la carta del jugador en la lista global (AC5)', () => {
      service.createGame('Sprint 1');
      service.registerUser('Luis', 'player');
      const luisId = service.currentUser()?.id;

      service.selectCard(8);

      const luisInList = service.players().find(p => p.id === luisId);
      expect(luisInList?.selectedCard).toBe('8');
      expect(luisInList?.hasSelectedCard).toBe(true);
    });
  });
});