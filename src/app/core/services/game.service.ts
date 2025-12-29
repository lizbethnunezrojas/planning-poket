import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User, UserRole, ViewMode } from '../models/user.model';

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
    this.listenToStorageChanges();
  }

  public revealCards(): void {
    if (this.currentUser()?.role === 'player') return;

    this._phase.set('loading');
    localStorage.setItem('planning_poker_phase', 'loading');

    setTimeout(() => {
      this._phase.set('revealed');
      localStorage.setItem('planning_poker_phase', 'revealed');
    }, 2000);
  }

  private initializePlayers(): void {
    const savedUser = this.loadUserFromStorage();
    const savedGame = this.loadGameFromStorage();
    if (!savedGame) return;

    const storageData = localStorage.getItem('planning_poker_players');
    let playersList: User[] = storageData ? JSON.parse(storageData) : [];

    if (playersList.length === 0) {
      playersList = [
        {
          id: '2',
          name: 'Alonso Q',
          role: 'player',
          viewMode: 'player',
          selectedCard: '13',
          hasSelectedCard: true,
          gameId: savedGame.id,
        },
        {
          id: '3',
          name: 'Micaela R',
          role: 'player',
          viewMode: 'player',
          selectedCard: '21',
          hasSelectedCard: true,
          gameId: savedGame.id,
        },
      ];
      localStorage.setItem('planning_poker_players', JSON.stringify(playersList));
    }

    if (savedUser && savedUser.gameId === savedGame.id) {
      const userIndex = playersList.findIndex((p) => p.id === savedUser.id);
      if (userIndex === -1) {
        playersList.push(savedUser);
        localStorage.setItem('planning_poker_players', JSON.stringify(playersList));
      } else {
        playersList[userIndex] = savedUser;
      }
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
    sessionStorage.removeItem(this.USER_KEY);
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

      this.saveUserSession(updatedUser);
      this.updatePlayerInList(updatedUser);
      return;
    }

    const gameId = (inviteGameId || this.gameSignal()?.id)?.trim();

    if (!gameId) return;

    const storageData = localStorage.getItem('planning_poker_players');
    const existingPlayers: User[] = storageData ? JSON.parse(storageData) : [];

    const hasAdmin = existingPlayers.some((p) => p.gameId === gameId && p.role === 'admin');
    const userRole: UserRole = hasAdmin ? 'player' : 'admin';

    const newUser: User = {
      id: this.generateUniqueId(),
      name: userName,
      role: userRole,
      viewMode: viewMode,
      selectedCard: null,
      hasSelectedCard: false,
      gameId: gameId,
    };

    this.saveUserSession(newUser);

    if (!this.gameSignal() || this.gameSignal()?.id !== gameId) {
      const gameData: Game = { id: gameId, name: 'Partida de Poker' };
      this.gameSignal.set(gameData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameData));
    }

    this._players.update((currentSignalPlayers) => {
      const isAlreadyInList = existingPlayers.find((p) => p.id === newUser.id);
      const newList = isAlreadyInList ? existingPlayers : [...existingPlayers, newUser];

      localStorage.setItem('planning_poker_players', JSON.stringify(newList));
      return newList;
    });
  }

  private saveUserSession(user: User): void {
    this.currentUserSignal.set(user);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private updatePlayerInList(updatedUser: User): void {
    this._players.update((players) => {
      const newList = players.map((p) => (p.id === updatedUser.id ? updatedUser : p));
      localStorage.setItem('planning_poker_players', JSON.stringify(newList));
      return newList;
    });
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

      sessionStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      this.updatePlayerInList(updatedUser);

      return updatedUser;
    });
  }

  private loadGameFromStorage(): Game | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  private loadUserFromStorage(): User | null {
    const data = sessionStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

    private listenToStorageChanges(): void {
  globalThis.addEventListener('storage', (event) => {
    if (event.key === 'planning_poker_phase' && event.newValue) {
      this._phase.set(event.newValue as GamePhase);
    }

    if (event.key === 'planning_poker_players' && event.newValue) {
      this._players.set(JSON.parse(event.newValue));
    }
  });
}

  public toggleSubAdmin(userId: string): void {
    if (this.currentUser()?.role !== 'admin') return;

    this._players.update((players) => {
      const newList = players.map((p) => {
        if (p.id === userId) {
          const newRole: UserRole = p.role === 'sub-admin' ? 'player' : 'sub-admin';
          return { ...p, role: newRole };
        }
        return p;
      });
      localStorage.setItem('planning_poker_players', JSON.stringify(newList));
      return newList;
    });
  }

  public resetGame(): void {
    if (this.currentUser()?.role === 'player') return;

    this._phase.set('voting');
    localStorage.setItem('planning_poker_phase', 'voting');

    this._players.update((players) => {
      const newList = players.map((p) => ({ ...p, selectedCard: null, hasSelectedCard: false }));
      localStorage.setItem('planning_poker_players', JSON.stringify(newList));
      return newList;
    });

    this.currentUserSignal.update((user) => {
      if (!user) return null;
      const updated = { ...user, selectedCard: null, hasSelectedCard: false };
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }
}
