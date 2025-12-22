import { render, screen} from '@testing-library/angular';
import { CreateGamePage } from './create-game-page';
import { GameService } from '../../../core/services/game.service';
import { Router } from '@angular/router';
import { vi, describe, it, expect } from 'vitest';

describe('CreateGamePage - Orquestación HU1', () => {
  
  const mockGameService = {
    createGame: vi.fn()
  };
  
  const mockRouter = {
    navigate: vi.fn()
  };

  const setup = async () => {
    return await render(CreateGamePage, {
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  };

  it('debería renderizar correctamente el título y el formulario', async () => {
    await setup();
    expect(screen.getByText(/Crear partida/i)).toBeTruthy();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

});