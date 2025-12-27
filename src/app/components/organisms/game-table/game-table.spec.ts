import { render, screen } from '@testing-library/angular';
import { GameTableComponent } from './game-table.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';
import { describe, it, expect } from 'vitest';

describe('GameTableComponent - HU09 & Estabilidad de Mesa', () => {
  
  const mockAdmin = { id: '1', name: 'Elizabeth', role: 'admin', viewMode: 'player' };
  const mockPlayer = { id: '2', name: 'Alexa', role: 'player', viewMode: 'player', selectedCard: '8' };


  it('debería renderizar siempre 8 contenedores de asiento (Criterio 3 - Estructura Fija)', async () => {
    const mockService = {
      players: signal([mockAdmin]),
      currentUser: signal(mockAdmin),
      phase: signal('voting'),
      isAdmin: signal(true)
    };

    const { container } = await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    const seats = container.querySelectorAll('.seat-container');
    expect(seats.length).toBe(8);
  });

  it('debería mostrar "Esperando..." en los asientos que no tienen jugador', async () => {
    const mockService = {
      players: signal([mockAdmin]), 
      currentUser: signal(mockAdmin),
      phase: signal('voting'),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    const waitingLabels = screen.getAllByText(/esperando.../i);
    expect(waitingLabels.length).toBe(7);
  });


  it('debería mostrar el nombre de los jugadores conectados (HU04)', async () => {
    const mockService = {
      players: signal([mockAdmin, mockPlayer]),
      currentUser: signal(mockAdmin),
      phase: signal('voting'),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    expect(screen.getByText(/Elizabeth/i)).toBeTruthy();
    expect(screen.getByText(/Alexa/i)).toBeTruthy();
  });

  it('debería mostrar el botón "Revelar cartas" solo si el usuario es Admin (HU05 - Criterio 1)', async () => {
    const mockService = {
      phase: signal('voting'),
      currentUser: signal(mockAdmin),
      players: signal([mockAdmin]),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    expect(screen.getByText(/revelar cartas/i)).toBeTruthy();
  });

  it('debería mostrar los valores de las cartas cuando la fase es "revealed" (HU05 - Criterio 2)', async () => {
    const mockService = {
      phase: signal('revealed'),
      currentUser: signal(mockAdmin),
      players: signal([mockPlayer]),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    expect(screen.getByText('8')).toBeTruthy();
  });
});