import { render, screen, fireEvent } from '@testing-library/angular';
import { CardDeckComponent } from './card-deck.component';
import { GameService } from '../../../core/services/game.service';
import { CardComponent } from '../../atoms/card/card.component';
import { signal } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';

describe('CardDeckComponent - HU10: Selección de Cartas', () => {
  const mockSelectCard = vi.fn();

  const setup = async (
    viewMode: 'player' | 'spectator' = 'player',
    role: 'admin' | 'player' = 'player',
    cards: (number | string)[] = [1, 2, 3, 5],
    selectedCard: string | null = null
  ) => {
    const mockService = {
      availableCards: signal(cards),
      currentUser: signal({
        id: 'user-123',
        name: 'Usuario Test',
        role: role,
        viewMode: viewMode,
        gameId: 'game-1',
        selectedCard: selectedCard,
      }),
      currentModeId: signal('fibonacci'),
      currentModeName: signal('Fibonacci'),
      selectCard: mockSelectCard,
    };

    return await render(CardDeckComponent, {
      imports: [CardComponent],
      providers: [{ provide: GameService, useValue: mockService }],
    });
  };

  it('debería mostrar el mazo si el usuario es ADMIN pero está en modo "player"', async () => {
    await setup('player', 'admin');
    const title = screen.queryByText(/Elige una carta/i);
    expect(title).not.toBeNull();
  });

  it('NO debería mostrar el mazo si el usuario es "spectator" aunque sea Admin', async () => {
    const { container } = await setup('spectator', 'admin');
    const deckSection = container.querySelector('.card-deck');
    expect(deckSection).toBeNull();
  });

  it('debería mostrar un mensaje cuando no hay ninguna carta registrada', async () => {
    await setup('player', 'player', []);
    const emptyMessage = screen.getByText(/No hay cartas registradas/i);
    expect(emptyMessage).toBeTruthy();
  });

  it('debería llamar al servicio con el puntaje correcto al elegir una carta', async () => {
    const cards = [1, 3, 5];
    await setup('player', 'player', cards);

    const cardToSelect = screen.getByText('3');
    fireEvent.click(cardToSelect);

    expect(mockSelectCard).toHaveBeenCalledWith(3);
  });

  it('debería resaltar visualmente la carta seleccionada', async () => {
    const { container } = await setup('player', 'player', [1, 3, 5], '5');

    const selectedElement = container.querySelector('.card--selected');
    expect(selectedElement).not.toBeNull();
    expect(selectedElement?.textContent).toContain('5');
  });

  it('debería renderizar la cantidad correcta de cartas dinámicamente', async () => {
    const cards = [0, 1, 2, 3, 5, 8];
    const { container } = await setup('player', 'player', cards);

    const cardElements = container.querySelectorAll('app-card');
    expect(cardElements.length).toBe(cards.length);
  });
});
