import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY = 'planning_poker_game';

  public createGame(gameName: string): Game {
    const newGameId = this.generateUniqueId();
    const newGame: Game = {
      id: newGameId,
      name: gameName,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newGame));

    console.log(`[GameService] Partida '${gameName}' creada con ID: ${newGameId}`);

    return newGame;
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  public getCurrentGame(): Game | null {
    const gameJson = localStorage.getItem(this.STORAGE_KEY);
    return gameJson ? (JSON.parse(gameJson) as Game) : null;
  }
}
