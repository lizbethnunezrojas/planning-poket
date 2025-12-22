import { render, screen } from '@testing-library/angular';
import { GameTableComponent } from './game-table.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';

describe('GameTableComponent - HU4', () => {
  const mockPlayers = [
    { id: '1', name: 'micaela r', viewMode: 'player', selectedCard: '5' }
  ];

  it('debería mostrar a los jugadores desde el servicio', async () => {
    await render(GameTableComponent, {
      providers: [
        {
          provide: GameService,
          useValue: {
            players: signal(mockPlayers),
            currentUser: signal(mockPlayers[0])
          }
        }
      ]
    });

    expect(screen.getByText('Micaela R')).toBeTruthy();
  });
});