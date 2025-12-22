import { render, screen, fireEvent } from '@testing-library/angular';
import { CardDeckComponent } from './card-deck.component';
import { GameService } from '../../../core/services/game.service';
import { CardComponent } from '../../atoms/card/card.component';
import { signal } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';

describe('CardDeckComponent - HU4: Selección de Cartas', () => {
  
  const mockSelectCard = vi.fn();

  const setup = async (viewMode: 'player' | 'spectator' = 'player', cards: (number | string)[] = [1, 2, 3, 5]) => {
    return await render(CardDeckComponent, {
      imports: [CardComponent],
      providers: [
        {
          provide: GameService,
          useValue: {
            availableCards: signal(cards),
            currentUser: signal({ 
              id: 'user-123', 
              name: 'Usuario Test', 
              role: 'player', 
              viewMode: viewMode,
              gameId: 'game-1' 
            }),
            selectCard: mockSelectCard
          }
        }
      ]
    });
  };

  it('debería mostrar el mazo solo si el usuario tiene tipo de visualización "player" (AC1)', async () => {
    await setup('player');
    const title = screen.queryByText(/Elige una carta/i);
    expect(title).not.toBeNull();
  });

  it('NO debería mostrar el mazo si el usuario es "spectator" (AC1)', async () => {
    const { container } = await setup('spectator');
    const deckContainer = container.querySelector('.card-deck');
    expect(deckContainer).toBeNull();
  });

  it('debería mostrar un mensaje cuando no hay ninguna carta registrada (AC4)', async () => {
    await setup('player', []); 
    const emptyMessage = screen.getByText(/No hay cartas registradas/i);
    expect(emptyMessage).toBeTruthy();
  });

  it('debería llamar al servicio con el puntaje correcto al elegir una carta (AC2, AC3, AC5)', async () => {
    const cards = [1, 3, 5];
    await setup('player', cards);

    const cardToSelect = screen.getByText('3');
    
    fireEvent.click(cardToSelect);

    expect(mockSelectCard).toHaveBeenCalledWith(3);
  });

  it('debería renderizar la cantidad correcta de cartas dinámicamente (AC4)', async () => {
    const cards = [0, 1, 2, 3, 5, 8];
    const { container } = await setup('player', cards);

    const cardElements = container.querySelectorAll('app-card');
    expect(cardElements.length).toBe(cards.length);
  });
});