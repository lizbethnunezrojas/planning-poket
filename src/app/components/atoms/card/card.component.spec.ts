import { render } from '@testing-library/angular';
import { CardComponent } from './card.component';
import { describe, it, expect } from 'vitest';

describe('CardComponent - Criterios de Aceptación', () => {
  
  it('debería mostrar la clase card--empty cuando no hay valor (voto en blanco)', async () => {
    const { container } = await render(CardComponent, {
      inputs: {
        userName: 'Micaela',
        viewMode: 'player',
        value: null,
        isRevealed: false
      }
    });

    const cardElement = container.querySelector('.card-container');
    expect(cardElement?.classList.contains('card--empty')).toBe(true);
  });

it('debería renderizar con formato circular y clase de espectador', async () => {
    const { container } = await render(CardComponent, {
      inputs: {
        userName: 'Jose Alberto',
        viewMode: 'spectator',
        value: null,
        isRevealed: false
      }
    });

    const cardContainer = container.querySelector('.card--spectator');
    
    expect(cardContainer).not.toBeNull();

    expect(cardContainer?.textContent?.trim()).toBe('JO');
  });
});