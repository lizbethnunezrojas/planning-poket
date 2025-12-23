import { render, screen} from '@testing-library/angular';
import { GameTableComponent } from './game-table.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';

describe('GameTableComponent - HU4', () => {
  const mockPlayers = [
    { id: '1', name: 'micaela r', viewMode: 'player', selectedCard: '5' }
  ];

it('debería mostrar a los jugadores desde el servicio', async () => {
  const mockGameService = {
    players: signal(mockPlayers),
    currentUser: signal(mockPlayers[0]),
    phase: signal('voting'), 
    isAdmin: signal(true),   
  };

  await render(GameTableComponent, {
    providers: [
      {
        provide: GameService,
        useValue: mockGameService
      }
    ]
  });

  expect(screen.getByText('Micaela R')).toBeTruthy();
});
});

describe('GameTableComponent - Integración HU5', () => {
  
  const mockAdmin = { id: '1', name: 'Admin', role: 'admin', viewMode: 'player' };
  const mockPlayer = { id: '2', name: 'Pepe', role: 'player', viewMode: 'player', selectedCard: '8' };
  const mockSpectator = { id: '3', name: 'Ojo', role: 'player', viewMode: 'spectator', selectedCard: '13' };

  it('debería mostrar el botón Revelar solo si el usuario es Admin (Criterio 1)', async () => {
    const mockService = {
      phase: signal('voting'),
      currentUser: signal(mockAdmin),
      players: signal([mockAdmin, mockPlayer]),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    expect(screen.getByText(/revelar cartas/i)).toBeTruthy();
  });

  it('debería mostrar los valores de las cartas cuando la fase es revealed (Criterio 2)', async () => {
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

  it('debería ocultar el valor si el usuario es espectador aunque esté revelado (Criterio 3)', async () => {
    const mockService = {
      phase: signal('revealed'),
      currentUser: signal(mockAdmin),
      players: signal([mockSpectator]),
      isAdmin: signal(true)
    };

    await render(GameTableComponent, {
      providers: [{ provide: GameService, useValue: mockService }]
    });

    const cardValue = screen.queryByText('13');
    expect(cardValue).toBeNull();
  });
});