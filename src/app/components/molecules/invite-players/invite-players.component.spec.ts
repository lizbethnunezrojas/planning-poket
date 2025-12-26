import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvitePlayersComponent } from './invite-players.component';
import { GameService } from '../../../core/services/game.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('InvitePlayersComponent', () => {
  let component: InvitePlayersComponent;
  let fixture: ComponentFixture<InvitePlayersComponent>;
  const mockCurrentGame = signal<any>(null);

  beforeEach(async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [InvitePlayersComponent],
      providers: [
        { provide: GameService, useValue: { currentGame: mockCurrentGame } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a clipboard.writeText y activar el estado "copied"', async () => {
    const testId = 'XYZ';
    mockCurrentGame.set({ id: testId });
    fixture.detectChanges();

    const expectedUrl = `${globalThis.location.origin}/join/${testId}`;

    component.copyLink();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedUrl);

    await Promise.resolve(); 
    expect(component.copied()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(component.copied()).toBe(false);
  });
});