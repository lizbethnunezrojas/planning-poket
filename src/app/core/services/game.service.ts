import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly USER_KEY = 'planning_poker_user';

  private generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

  private readonly gameSignal = signal<Game | null>(this.loadGameFromStorage());
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private readonly playersSignal = signal<User[]>([]); 

  public currentGame = this.gameSignal.asReadonly();
  public currentUser = this.currentUserSignal.asReadonly();
  public players = this.playersSignal.asReadonly();

  public isGameReady = computed(() => !!this.gameSignal() && !!this.currentUserSignal());

  constructor() {
    this.mockPlayers();
  }

  public createGame(gameName: string, userName: string): void {
    const gameId = this.generateUniqueId();
    const newGame: Game = { id: gameId, name: gameName };
    
    const newUser: User = {
      id: this.generateUniqueId(), 
      name: userName,
      role: 'player',
      viewMode: 'player',
      selectedCard: null,
      hasSelectedCard: false,
      gameId: gameId
    };

    this.gameSignal.set(newGame);
    this.currentUserSignal.set(newUser);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newGame));
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
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
      { id: '2', name: 'Alonso Q', role: 'player', viewMode: 'player', selectedCard: null, hasSelectedCard: false, gameId: 'mock' },
      { id: '3', name: 'Micaela R', role: 'player', viewMode: 'player', selectedCard: null, hasSelectedCard: false, gameId: 'mock' },
    ]);
  }
}