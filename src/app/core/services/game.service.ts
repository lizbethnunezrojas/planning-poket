/* import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User, UserRole, ViewMode } from '../models/user.model';

export type GamePhase = 'voting' | 'loading' | 'revealed';
export interface ScoringMode {
  id: string;
  name: string;
  cards: (number | string)[];
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly MAX_PLAYERS = 8;
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

  private readonly SCORING_MODES: ScoringMode[] = [
    { id: 'fibonacci', name: 'Fibonacci', cards: [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'] },
    { id: 'powers', name: 'Potencias de 2', cards: [0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'] },
  ];

  private readonly _currentModeId = signal<string>(
    localStorage.getItem('planning_poker_mode') || this.SCORING_MODES[0].id
  );

  public readonly availableCards = computed(() => {
    const mode = this.SCORING_MODES.find((m) => m.id === this._currentModeId());
    return mode ? mode.cards : this.SCORING_MODES[0].cards;
  });

  public readonly currentModeId = this._currentModeId.asReadonly();
  public readonly scoringModes = signal<ScoringMode[]>(this.SCORING_MODES).asReadonly();

  public readonly currentModeName = computed(() => {
    return this.SCORING_MODES.find((m) => m.id === this._currentModeId())?.name || '';
  });

  public isGameReady = computed(() => !!this.gameSignal() && !!this.currentUserSignal());
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');

  public canManageGame = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'sub-admin';
  });

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

  public changeScoringMode(modeId: string): void {
    if (!this.isAdmin()) return;

    this._currentModeId.set(modeId);
    localStorage.setItem('planning_poker_mode', modeId);

    this.resetVotesInternal();
  }

  private resetVotesInternal(): void {
    this._players.update((players) => {
      const newList = players.map((p) => ({
        ...p,
        selectedCard: p.isMock ? p.initialVote ?? null : null,
        hasSelectedCard: !!p.isMock,
      }));

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

  public revealCards(): void {
    if (this.currentUser()?.role === 'player') return;
    const players = this._players();
    const voters = players.filter((p) => p.viewMode === 'player');
    const allHaveVoted = voters.every((p) => p.hasSelectedCard);

    if (!allHaveVoted) {
      alert(
        'No se pueden revelar los votos hasta que todos los jugadores hayan seleccionado una carta.'
      );
      return;
    }

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

    const hasMocks = playersList.some((p) => p.id === '2');

    if (!hasMocks) {
      const mocks: User[] = [
        {
          id: '2',
          name: 'Alonso Q',
          role: 'player',
          viewMode: 'player',
          selectedCard: '8',
          hasSelectedCard: true,
          gameId: savedGame.id,
          isMock: true,
          initialVote: '8',
        },
        {
          id: '3',
          name: 'Micaela R',
          role: 'player',
          viewMode: 'player',
          selectedCard: '2',
          hasSelectedCard: true,
          gameId: savedGame.id,
          isMock: true,
          initialVote: '2',
        },
        {
          id: '3',
          name: 'Carmen',
          role: 'player',
          viewMode: 'player',
          selectedCard: '4',
          hasSelectedCard: true,
          gameId: savedGame.id,
          isMock: true,
          initialVote: '4',
        },
        {
          id: '4',
          name: 'Michel',
          role: 'player',
          viewMode: 'player',
          selectedCard: '6',
          hasSelectedCard: true,
          gameId: savedGame.id,
          isMock: true,
          initialVote: '6',
        },
        {
          id: '5',
          name: 'Andres',
          role: 'player',
          viewMode: 'player',
          selectedCard: '2',
          hasSelectedCard: true,
          gameId: savedGame.id,
          isMock: true,
          initialVote: '2',
        },
      ];
      playersList = [...mocks, ...playersList];
    }

    if (savedUser && savedUser.gameId === savedGame.id) {
      const userIndex = playersList.findIndex((p) => p.id === savedUser.id);

      if (userIndex === -1) {
        playersList.push(savedUser);
      } else {
        playersList[userIndex] = savedUser;
      }
    }

    localStorage.setItem('planning_poker_players', JSON.stringify(playersList));
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
    const savedGame = this.loadGameFromStorage();

    const gameId = (inviteGameId || this.gameSignal()?.id)?.trim();

    if (!gameId || savedGame?.id !== gameId) {
      console.error('Acceso denegado: La partida no existe o el ID es inválido.');
      return;
    }

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

    const storageData = localStorage.getItem('planning_poker_players');
    const existingPlayers: User[] = storageData ? JSON.parse(storageData) : [];

    if (existingPlayers.length >= this.MAX_PLAYERS) {
      alert('Lo sentimos, la partida está llena. Máximo 8 jugadores.');
      return;
    }

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

    const isAlreadyInList = existingPlayers.some((p) => p.id === newUser.id);
    const newList = isAlreadyInList ? existingPlayers : [...existingPlayers, newUser];
    localStorage.setItem('planning_poker_players', JSON.stringify(newList));

    this.initializePlayers();
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
      const { key, newValue } = event;

      if (!newValue) return;

      switch (key) {
        case 'planning_poker_phase':
          this._phase.set(newValue as GamePhase);
          break;

        case 'planning_poker_players': {
          const updatedPlayers: User[] = JSON.parse(newValue);
          this._players.set(updatedPlayers);

          const myCurrentId = this.currentUserSignal()?.id;
          const myNewData = updatedPlayers.find((p) => p.id === myCurrentId);

          if (myNewData) {
            if (myNewData.role !== this.currentUserSignal()?.role) {
              console.log(`Sistema: Tu rol ha cambiado a ${myNewData.role}`);
            }

            this.currentUserSignal.set(myNewData);
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(myNewData));
          }
          break;
        }

        case 'planning_poker_mode':
          this._currentModeId.set(newValue);

          this.currentUserSignal.update((user) => {
            if (!user) return null;
            const updated = { ...user, selectedCard: null, hasSelectedCard: false };
            sessionStorage.setItem(this.USER_KEY, JSON.stringify(updated));
            return updated;
          });
          break;
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
      const newList = players.map((p) => ({
        ...p,
        selectedCard: p.isMock ? p.initialVote ?? null : null,
        hasSelectedCard: !!p.isMock,
      }));

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
 */

import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { User, UserRole, ViewMode } from '../models/user.model';

export type GamePhase = 'voting' | 'loading' | 'revealed';

export interface ScoringMode {
  id: string;
  name: string;
  cards: (number | string)[];
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // --- CONSTANTES ---
  private readonly MAX_PLAYERS = 8;
  private readonly KEYS = {
    GAME: 'planning_poker_game',
    USER: 'planning_poker_user',
    PLAYERS: 'planning_poker_players',
    PHASE: 'planning_poker_phase',
    MODE: 'planning_poker_mode',
  };

  private readonly SCORING_MODES: ScoringMode[] = [
    { id: 'fibonacci', name: 'Fibonacci', cards: [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'] },
    { id: 'powers', name: 'Potencias de 2', cards: [0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'] },
  ];

  // --- SIGNALS PRIVADOS ---
  private readonly gameSignal = signal<Game | null>(
    this.loadFromStorage<Game>(this.KEYS.GAME, 'local')
  );
  private readonly currentUserSignal = signal<User | null>(
    this.loadFromStorage<User>(this.KEYS.USER, 'session')
  );
  private readonly _players = signal<User[]>([]);
  private readonly _phase = signal<GamePhase>('voting');
  private readonly _currentModeId = signal<string>(
    localStorage.getItem(this.KEYS.MODE) || this.SCORING_MODES[0].id
  );

  // --- PROPIEDADES PÚBLICAS (READONLY) ---
  public readonly currentGame = this.gameSignal.asReadonly();
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly players = this._players.asReadonly();
  public readonly phase = this._phase.asReadonly();
  public readonly currentModeId = this._currentModeId.asReadonly();
  public readonly scoringModes = signal<ScoringMode[]>(this.SCORING_MODES).asReadonly();

  // --- COMPUTED PROPERTIES ---
  public readonly availableCards = computed(
    () =>
      this.SCORING_MODES.find((m) => m.id === this._currentModeId())?.cards ||
      this.SCORING_MODES[0].cards
  );

  public readonly currentModeName = computed(
    () => this.SCORING_MODES.find((m) => m.id === this._currentModeId())?.name || ''
  );

  public readonly isGameReady = computed(() => !!this.gameSignal() && !!this.currentUserSignal());
  public readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  public readonly canManageGame = computed(() =>
    ['admin', 'sub-admin'].includes(this.currentUser()?.role || '')
  );

  public readonly averageScore = computed(() => {
    const voters = this._players().filter(
      (p) => p.viewMode === 'player' && p.selectedCard !== null
    );
    const numericVotes = voters
      .map((p) => Number(p.selectedCard))
      .filter((val) => !Number.isNaN(val));
    if (numericVotes.length === 0) return '0.0';
    return (numericVotes.reduce((acc, val) => acc + val, 0) / numericVotes.length).toFixed(1);
  });

  public readonly summaryVotes = computed(() => {
    const votes = this._players()
      .filter((p) => p.viewMode === 'player' && p.selectedCard !== null)
      .map((p) => p.selectedCard as string);

    const counts = votes.reduce(
      (acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }),
      {} as Record<string, number>
    );

    return Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => Number(a.value) - Number(b.value));
  });

  constructor() {
    this.initializePlayers();
    this.listenToStorageChanges();
  }

  // --- MÉTODOS PÚBLICOS ---

  public createGame(gameName: string): void {
    const newGame: Game = { id: this.generateUniqueId(), name: gameName };
    this.gameSignal.set(newGame);
    localStorage.setItem(this.KEYS.GAME, JSON.stringify(newGame));
    this.clearUserSession();
  }

  public registerUser(userName: string, viewMode: ViewMode, inviteGameId?: string): void {
    const gameId = (inviteGameId || this.gameSignal()?.id)?.trim();
    if (!gameId || this.loadFromStorage<Game>(this.KEYS.GAME, 'local')?.id !== gameId) return;

    if (this.currentUserSignal()) {
      this.updateExistingUser(userName, viewMode);
      return;
    }

    const existingPlayers = this.getStoredPlayers();
    if (existingPlayers.length >= this.MAX_PLAYERS) {
      alert('Partida llena (Máx 8 jugadores)');
      return;
    }

    const newUser: User = {
      id: this.generateUniqueId(),
      name: userName,
      role: existingPlayers.some((p) => p.gameId === gameId && p.role === 'admin')
        ? 'player'
        : 'admin',
      viewMode,
      selectedCard: null,
      hasSelectedCard: false,
      gameId,
    };

    this.saveUserSession(newUser);
    this.syncPlayersWithStorage([...existingPlayers, newUser]);
    this.initializePlayers();
  }

  public selectCard(value: string | number): void {
    this.currentUserSignal.update((user) => {
      if (!user) return null;
      const updated = { ...user, selectedCard: value.toString(), hasSelectedCard: true };
      this.saveUserSession(updated);
      this.updatePlayerInList(updated);
      return updated;
    });
  }

  public revealCards(): void {
    if (!this.canManageGame || !this.checkAllHaveVoted()) return;

    this.updateGlobalPhase('loading');
    setTimeout(() => this.updateGlobalPhase('revealed'), 2000);
  }

  public resetGame(): void {
    if (this.currentUser()?.role === 'player') return;
    this.updateGlobalPhase('voting');
    this.resetAllVotes();
  }

  public changeScoringMode(modeId: string): void {
    if (!this.isAdmin()) return;
    this._currentModeId.set(modeId);
    localStorage.setItem(this.KEYS.MODE, modeId);
    this.resetAllVotes();
  }

  public toggleSubAdmin(userId: string): void {
    if (!this.isAdmin()) return;
    this._players.update((players) => {
      const newList = players.map((p) =>
        p.id === userId
          ? { ...p, role: (p.role === 'sub-admin' ? 'player' : 'sub-admin') as UserRole }
          : p
      );
      this.syncPlayersWithStorage(newList);
      return newList;
    });
  }

  // --- MÉTODOS PRIVADOS DE APOYO ---

  private initializePlayers(): void {
    const savedGame = this.loadFromStorage<Game>(this.KEYS.GAME, 'local');
    if (!savedGame) return;

    let players = this.getStoredPlayers();
    if (!players.some((p) => p.isMock)) {
      players = [...this.getMocks(savedGame.id), ...players];
    }

    const user = this.loadFromStorage<User>(this.KEYS.USER, 'session');
    if (user?.gameId === savedGame.id) {
      const idx = players.findIndex((p) => p.id === user.id);
      if (idx === -1) {
        players.push(user);
      } else {
        players[idx] = user;
      }
    }

    this.syncPlayersWithStorage(players);
    this._players.set(players);
  }

  private resetAllVotes(): void {
    this._players.update((players) => {
      const newList = players.map((p) => ({
        ...p,
        selectedCard: p.isMock ? p.initialVote ?? null : null,
        hasSelectedCard: !!p.isMock,
      }));
      this.syncPlayersWithStorage(newList);
      return newList;
    });

    this.currentUserSignal.update((user) => {
      if (!user) return null;
      const updated = { ...user, selectedCard: null, hasSelectedCard: false };
      sessionStorage.setItem(this.KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }

  private updateExistingUser(name: string, viewMode: ViewMode): void {
    const updated = {
      ...this.currentUserSignal()!,
      name,
      viewMode,
      selectedCard:
        viewMode === 'spectator' ? null : this.currentUserSignal()?.selectedCard || null,
      hasSelectedCard:
        viewMode === 'spectator' ? false : this.currentUserSignal()?.hasSelectedCard || false,
    };
    this.saveUserSession(updated);
    this.updatePlayerInList(updated);
  }

  private checkAllHaveVoted(): boolean {
    const voters = this._players().filter((p) => p.viewMode === 'player');
    if (voters.every((p) => p.hasSelectedCard)) return true;
    alert('Faltan jugadores por votar');
    return false;
  }

  private updateGlobalPhase(phase: GamePhase): void {
    this._phase.set(phase);
    localStorage.setItem(this.KEYS.PHASE, phase);
  }

  private syncPlayersWithStorage(list: User[]): void {
    localStorage.setItem(this.KEYS.PLAYERS, JSON.stringify(list));
  }

  private getStoredPlayers(): User[] {
    return JSON.parse(localStorage.getItem(this.KEYS.PLAYERS) || '[]');
  }

  private saveUserSession(user: User): void {
    this.currentUserSignal.set(user);
    sessionStorage.setItem(this.KEYS.USER, JSON.stringify(user));
  }

  private clearUserSession(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(this.KEYS.USER);
  }

  private updatePlayerInList(user: User): void {
    this._players.update((list) => list.map((p) => (p.id === user.id ? user : p)));
    this.syncPlayersWithStorage(this._players());
  }

  private readonly generateUniqueId = () =>
    Math.random().toString(36).substring(2, 9).toUpperCase();

  private loadFromStorage<T>(key: string, type: 'local' | 'session'): T | null {
    const data = type === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private getMocks(gameId: string): User[] {
    return [
      {
        id: '2',
        name: 'Alonso Q',
        role: 'player',
        viewMode: 'player',
        selectedCard: '8',
        hasSelectedCard: true,
        gameId,
        isMock: true,
        initialVote: '8',
      },
      {
        id: '3',
        name: 'Micaela R',
        role: 'player',
        viewMode: 'player',
        selectedCard: '2',
        hasSelectedCard: true,
        gameId,
        isMock: true,
        initialVote: '2',
      },
      {
        id: '4',
        name: 'Carmen',
        role: 'player',
        viewMode: 'player',
        selectedCard: '4',
        hasSelectedCard: true,
        gameId,
        isMock: true,
        initialVote: '4',
      },
      {
        id: '5',
        name: 'Michel',
        role: 'player',
        viewMode: 'player',
        selectedCard: '6',
        hasSelectedCard: true,
        gameId,
        isMock: true,
        initialVote: '6',
      },
      {
        id: '6',
        name: 'Andres',
        role: 'player',
        viewMode: 'player',
        selectedCard: '2',
        hasSelectedCard: true,
        gameId,
        isMock: true,
        initialVote: '2',
      },
    ];
  }

  private listenToStorageChanges(): void {
    globalThis.addEventListener('storage', ({ key, newValue }) => {
      if (!newValue) return;
      switch (key) {
        case this.KEYS.PHASE:
          this._phase.set(newValue as GamePhase);
          break;
        case this.KEYS.MODE:
          this._currentModeId.set(newValue);
          this.resetAllVotes();
          break;
        case this.KEYS.PLAYERS: {
          const players = JSON.parse(newValue);
          this._players.set(players);
          const me = players.find((p: User) => p.id === this.currentUserSignal()?.id);
          if (me) {
            this.currentUserSignal.set(me);
            sessionStorage.setItem(this.KEYS.USER, JSON.stringify(me));
          }
          break;
        }
      }
    });
  }
}
