import { Injectable } from '@angular/core';
import { User, ViewMode } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'planning_poker_user';

  public saveUser(data: { name: string; viewMode: ViewMode }): void {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      viewMode: data.viewMode,
      role: 'admin',
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
  }

  public getCurrentUser(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? (JSON.parse(data) as User) : null;
  }

  public clearUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
