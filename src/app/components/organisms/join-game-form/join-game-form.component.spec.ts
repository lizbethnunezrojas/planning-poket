import { render, screen } from '@testing-library/angular';
import { JoinGameFormComponent } from './join-game-form.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect } from 'vitest';

describe('JoinGameFormComponent - HU12: Edición de Perfil', () => {
  const mockUser = {
    id: 'U123',
    name: 'Elizabeth',
    viewMode: 'player',
    gameId: 'G456',
  };

  const setup = async (userData: any = null, routeId: string = 'G456') => {
    return await render(JoinGameFormComponent, {
      providers: [
        {
          provide: GameService,
          useValue: { currentUser: signal(userData) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: routeId } },
          },
        },
      ],
    });
  };

  it('debería pre-llenar y deshabilitar el campo nombre si el usuario ya existe (HU12)', async () => {
    await setup(mockUser);

    const nameInput = screen.getByLabelText<HTMLInputElement>(/tu nombre/i);

    expect(nameInput.value).toBe('Elizabeth');
    expect(nameInput.disabled).toBe(true);
  });

  it('debería permitir cambiar el modo de visualización aunque el nombre esté bloqueado', async () => {
    const { fixture } = await setup(mockUser);
    const component = fixture.componentInstance;

    component.joinForm.patchValue({ viewMode: 'spectator' });

    expect(component.joinForm.valid).toBe(true);
    expect(component.joinForm.getRawValue().name).toBe('Elizabeth');
    expect(component.joinForm.getRawValue().viewMode).toBe('spectator');
  });
});
