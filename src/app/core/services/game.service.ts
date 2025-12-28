import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User, UserRole, ViewMode } from '../models/user.model';

// Fases del juego
export type GamePhase = 'voting' | 'loading' | 'revealed';
@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY = 'planning_poker_game';
  private readonly USER_KEY = 'planning_poker_user';
  private readonly gameSignal = signal<Game | null>(this.loadGameFromStorage());
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  private readonly _players = signal<User[]>([]);
  private readonly _phase = signal<GamePhase>('voting');
  public readonly currentGame = this.gameSignal.asReadonly();
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly players = this._players.asReadonly();
  public readonly phase = this._phase.asReadonly();
  public readonly availableCards = signal<(number | string)[]>([
    0,
    1,
    3,
    5,
    8,
    13,
    21,
    34,
    55,
    89,
    '?',
    '☕',
  ]).asReadonly();

  public isGameReady = computed(() => !!this.gameSignal() && !!this.currentUserSignal());
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');
  // Promedio
  public averageScore = computed(() => {
    const voters = this._players().filter(
      (p) => p.viewMode === 'player' && p.selectedCard !== null
    );

    const numericVotes = voters
      .map((p) => Number(p.selectedCard))
      .filter((val) => !Number.isNaN(val));

    if (numericVotes.length === 0) return '0.0';

    const sum = numericVotes.reduce((acc, val) => acc + val, 0);
    return (sum / numericVotes.length).toFixed(1);
  });

  public summaryVotes = computed(() => {
    const votes = this._players()
      .filter((p) => p.viewMode === 'player' && p.selectedCard !== null)
      .map((p) => p.selectedCard as string);

    const counts = votes.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => Number(a.value) - Number(b.value));
  });

  constructor() {
    this.initializePlayers();
  }

  public revealCards(): void {
    this._phase.set('loading');
    setTimeout(() => {
      this._phase.set('revealed');
    }, 2000);
  }

  private initializePlayers(): void {
    const savedUser = this.loadUserFromStorage();
    const savedGame = this.loadGameFromStorage();

    const playersList: User[] = [
      {
        id: '2',
        name: 'Alonso Q',
        role: 'player',
        viewMode: 'player',
        selectedCard: '13',
        hasSelectedCard: false,
        gameId: 'mock',
      },
      {
        id: '3',
        name: 'Micaela R',
        role: 'player',
        viewMode: 'player',
        selectedCard: '21',
        hasSelectedCard: false,
        gameId: 'mock',
      },
    ];

    if (savedUser && savedGame && savedUser.gameId === savedGame.id) {
      playersList.push(savedUser);
    }

    this._players.set(playersList);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  public createGame(gameName: string): void {
    const gameId = this.generateUniqueId();
    const newGame: Game = { id: gameId, name: gameName };

    this.gameSignal.set(newGame);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newGame));

    this.currentUserSignal.set(null);
    localStorage.removeItem(this.USER_KEY);
  }

  public registerUser(userName: string, viewMode: ViewMode, inviteGameId?: string): void {
    const existingUser = this.currentUserSignal();

    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        name: userName, 
        viewMode: viewMode,
        selectedCard: viewMode === 'spectator' ? null : existingUser.selectedCard,
        hasSelectedCard: viewMode === 'spectator' ? false : existingUser.hasSelectedCard,
      };

      this.currentUserSignal.set(updatedUser);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

      this._players.update((players) =>
        players.map((p) => (p.id === updatedUser.id ? updatedUser : p))
      );
      return; 
    }

    const isGuest = !this.gameSignal() && !!inviteGameId;
    const gameId = (inviteGameId || this.gameSignal()?.id)?.trim();

    if (!gameId) return;

    let userRole: UserRole = 'player';
    if (!isGuest && !this.currentUserSignal()) {
      userRole = 'admin';
    }

    const newUser: User = {
      id: this.generateUniqueId(),
      name: userName,
      role: userRole,
      viewMode: viewMode,
      selectedCard: null,
      hasSelectedCard: false,
      gameId: gameId,
    };

    this.currentUserSignal.set(newUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));

    if (isGuest) {
      const guestGame: Game = { id: gameId, name: 'Sprint 32' };
      this.gameSignal.set(guestGame);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(guestGame));

      const simulatedAdmin: User = {
        id: 'admin-123',
        name: 'Admin (Creador)',
        role: 'admin' as UserRole,
        viewMode: 'player' as ViewMode,
        selectedCard: null,
        hasSelectedCard: false,
        gameId,
      };

      this._players.set([
        simulatedAdmin,
        {
          id: '2',
          name: 'Alonso Q',
          role: 'player' as UserRole,
          viewMode: 'player' as ViewMode,
          selectedCard: '13',
          hasSelectedCard: true,
          gameId,
        },
        newUser,
      ]);
    } else {
      this._players.update((players) => [...players, newUser]);
    }
  }


  public selectCard(value: string | number): void {
    const cardValue = value.toString();
    this.currentUserSignal.update((user) => {
      if (!user) return null;

      const updatedUser = {
        ...user,
        selectedCard: cardValue,
        hasSelectedCard: true,
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });

    this._players.update((players) =>
      players.map((p) =>
        p.id === this.currentUserSignal()?.id
          ? { ...p, selectedCard: cardValue, hasSelectedCard: true }
          : p
      )
    );
  }

  private loadGameFromStorage(): Game | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  private loadUserFromStorage(): User | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  public resetGame(): void {
    if (!this.isAdmin()) return;

    this._phase.set('voting');

    this._players.update((players) =>
      players.map((player) => ({
        ...player,
        selectedCard: null,
        hasSelectedCard: false,
      }))
    );

    this.currentUserSignal.update((user) => {
      if (!user) return null;
      const updatedUser = { ...user, selectedCard: null, hasSelectedCard: false };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }
}
