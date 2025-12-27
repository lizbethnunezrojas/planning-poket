import { render, screen } from '@testing-library/angular';
import { CardComponent } from './card.component';
import { describe, it, expect } from 'vitest';

describe('CardComponent - Criterios de Aceptación (HU09)', () => {
  
  it('debería mostrar la carta en blanco (card--empty) cuando el jugador no ha elegido carta', async () => {
    const { container } = await render(CardComponent, {
      componentInputs: {
        userName: 'Elizabeth',
        viewMode: 'player',
        value: null, 
        isRevealed: false,
      },
    });

    const cardElement = container.querySelector('.card-container');
    expect(cardElement?.classList.contains('card--empty')).toBe(true);
  });

  it('debería renderizar el diseño tipo espectador con las dos primeras letras', async () => {
    const { container } = await render(CardComponent, {
      componentInputs: {
        userName: 'Jose Alberto',
        viewMode: 'spectator',
        value: null,
        isRevealed: false,
      },
    });

    const cardContainer = container.querySelector('.card--spectator');
    expect(cardContainer?.textContent?.trim()).toBe('JO');
    expect(cardContainer?.classList.contains('card--spectator')).toBe(true);
  });

  it('debería mostrar el estado "voto oculto" (card--hidden) cuando hay un valor pero no está revelado', async () => {
    const { container } = await render(CardComponent, {
      componentInputs: {
        userName: 'Micaela',
        viewMode: 'player',
        value: '5',
        isRevealed: false,
      },
    });

    const cardElement = container.querySelector('.card-container');
    expect(cardElement?.classList.contains('card--hidden')).toBe(true);
  });

  it('debería mostrar el valor real cuando la carta es revelada', async () => {
    await render(CardComponent, {
      componentInputs: {
        userName: 'Micaela',
        viewMode: 'player',
        value: '8',
        isRevealed: true,
      },
    });

    expect(screen.getByText('8')).toBeTruthy();
  });
});