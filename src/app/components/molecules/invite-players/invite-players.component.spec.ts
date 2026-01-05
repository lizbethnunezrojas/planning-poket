import { render, screen, fireEvent } from '@testing-library/angular';
import { InvitePlayersComponent } from './invite-players.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('InvitePlayersComponent - Cierre HU11', () => {
  const mockId = 'XWARXH4';
  const mockCurrentGame = signal({ id: mockId, name: 'Sprint 32' });

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('debería copiar al portapapeles y manejar el estado visual por 1 segundo (AC2)', async () => {
    const { fixture } = await render(InvitePlayersComponent, {
      providers: [
        {
          provide: GameService,
          useValue: { currentGame: mockCurrentGame },
        },
      ],
    });

    const openBtn = screen.getByRole('button', { name: /invitar jugadores/i });
    fireEvent.click(openBtn);
    fixture.detectChanges();

    const copyBtn = screen.getByText(/copiar link/i);
    fireEvent.click(copyBtn);

    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(screen.getByText(/¡copiado!/i)).toBeTruthy();

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(screen.queryByText(/¡copiado!/i)).toBeNull();
    expect(screen.getByText(/copiar link/i)).toBeTruthy();
  });
});
