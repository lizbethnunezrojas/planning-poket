import { render, screen } from '@testing-library/angular';
import { GameTableComponent } from './game-table.component';
import { User } from '../../../core/models/user.model';
import { describe, it, expect } from 'vitest';

describe.skip('GameTableComponent - Criterios de Aceptación', () => {

  const mockPlayers: User[] = [
    { 
      id: '1', 
      name: 'micaela r', 
      viewMode: 'player', 
      role: 'player', 
      selectedCard: '5', 
      hasSelectedCard: true, 
      gameId: '123' 
    },
    { 
      id: '2', 
      name: 'alonso q', 
      viewMode: 'player', 
      role: 'player', 
      selectedCard: null, 
      hasSelectedCard: false, 
      gameId: '123' 
    }
  ];

  it('debería mostrar a todos los jugadores y formatear sus nombres', async () => {
    await render(GameTableComponent, {
      componentInputs: {
        players: mockPlayers,
        currentUserId: '1',
        tableRevealed: false
      }
    });

    expect(screen.getByText('Micaela R')).toBeDefined();
    expect(screen.getByText('Alonso Q')).toBeDefined();
  });
});