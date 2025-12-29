import { render, screen } from '@testing-library/angular';
import { GameTableComponent } from './game-table.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { PlayerSeatComponent } from '../../molecules/player-seat/player-seat.component';

describe('GameTableComponent - HU09 & Estabilidad de Mesa', () => {
  const mockAdmin = { id: '1', name: 'Elizabeth', role: 'admin', gameId: 'g1', viewMode: 'player' };
  const mockPlayer = {
    id: '2',
    name: 'Alexa',
    role: 'player',
    gameId: 'g1',
    viewMode: 'player',
    selectedCard: '8',
    hasSelectedCard: true,
  };

  const createMockService = (currentUser: any, players: any[], phase = 'voting') => ({
    players: signal(players),
    currentUser: signal(currentUser),
    phase: signal(phase),
    isAdmin: signal(currentUser?.role === 'admin'),
    canManageGame: signal(currentUser?.role === 'admin' || currentUser?.role === 'sub-admin'),
    availableCards: signal([1, 2, 3]),
  });

  it('debería renderizar siempre 8 contenedores de asiento (Criterio 3 - Estructura Fija)', async () => {
    const mockService = createMockService(mockAdmin, [mockAdmin]);

    const { container } = await render(GameTableComponent, {
      imports: [PlayerSeatComponent], // Importante añadir la nueva molécula
      providers: [{ provide: GameService, useValue: mockService }],
    });

    const seats = container.querySelectorAll('.seat-container');
    expect(seats.length).toBe(8);
  });

  it('debería mostrar "Esperando..." en los asientos que no tienen jugador', async () => {
    const mockService = createMockService(mockAdmin, [mockAdmin]);

    await render(GameTableComponent, {
      imports: [PlayerSeatComponent],
      providers: [{ provide: GameService, useValue: mockService }],
    });

    const waitingLabels = screen.getAllByText(/esperando.../i);
    expect(waitingLabels.length).toBe(7);
  });

  it('debería mostrar el nombre de los jugadores conectados (HU04)', async () => {
    const mockService = createMockService(mockAdmin, [mockAdmin, mockPlayer]);

    await render(GameTableComponent, {
      imports: [PlayerSeatComponent],
      providers: [{ provide: GameService, useValue: mockService }],
    });

    expect(screen.getByText(/Elizabeth/i)).toBeTruthy();
    expect(screen.getByText(/Alexa/i)).toBeTruthy();
  });

  it('debería mostrar el botón "Revelar cartas" si el usuario tiene permiso (HU13)', async () => {
    const mockService = createMockService(mockAdmin, [mockAdmin, mockPlayer]);

    await render(GameTableComponent, {
      imports: [PlayerSeatComponent],
      providers: [{ provide: GameService, useValue: mockService }],
    });

    expect(screen.getByText(/revelar cartas/i)).toBeTruthy();
  });

  it('debería mostrar los valores de las cartas cuando la fase es "revealed"', async () => {
    const mockService = createMockService(mockAdmin, [mockPlayer], 'revealed');

    await render(GameTableComponent, {
      imports: [PlayerSeatComponent],
      providers: [{ provide: GameService, useValue: mockService }],
    });

    expect(screen.getByText('8')).toBeTruthy();
  });
});
