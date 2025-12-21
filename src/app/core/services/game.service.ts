import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly USER_KEY = 'planning_poker_user';

  private readonly gameSignal = signal<Game | null>(this.loadGameFromStorage());
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private readonly playersSignal = signal<User[]>([]);
  private readonly availableCardsSignal = signal<(number | string)[]>([0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕']);
  public availableCards = this.availableCardsSignal.asReadonly();

  public currentGame = this.gameSignal.asReadonly();
  public currentUser = this.currentUserSignal.asReadonly();
  public players = this.playersSignal.asReadonly();

  public isGameReady = computed(() => !!this.gameSignal() && !!this.currentUserSignal());

  constructor() {
    this.mockPlayers();
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  public createGame(gameName: string): void {
    const gameId = this.generateUniqueId();
    const newGame: Game = { id: gameId, name: gameName };

    this.gameSignal.set(newGame);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newGame));
  }

  public registerUser(userName: string, viewMode: 'player' | 'spectator'): void {
    const currentGame = this.gameSignal();
    if (!currentGame) return;

    const role = this.currentUserSignal() ? 'player' : 'admin';

    const newUser: User = {
      id: this.generateUniqueId(),
      name: userName,
      role: role,
      viewMode: viewMode,
      selectedCard: null,
      hasSelectedCard: false,
      gameId: currentGame.id,
    };

    this.currentUserSignal.set(newUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
  }

  public selectCard(value: string | number): void {
    this.currentUserSignal.update((user) => {
      if (!user) return null;

      const updatedUser = {
        ...user,
        selectedCard: value.toString(),
        hasSelectedCard: true,
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });
  }

  private loadGameFromStorage(): Game | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  private loadUserFromStorage(): User | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  private mockPlayers() {
    this.playersSignal.set([
      {
        id: '2',
        name: 'Alonso Q',
        role: 'player',
        viewMode: 'player',
        selectedCard: null,
        hasSelectedCard: false,
        gameId: 'mock',
      },
      {
        id: '3',
        name: 'Micaela R',
        role: 'player',
        viewMode: 'player',
        selectedCard: null,
        hasSelectedCard: false,
        gameId: 'mock',
      },
    ]);
  }
}
