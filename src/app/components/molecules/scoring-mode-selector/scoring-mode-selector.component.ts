import { Component, inject, signal } from '@angular/core';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-scoring-mode-selector',
  standalone: true,
  imports: [],
  templateUrl: './scoring-mode-selector.component.html',
  styleUrls: ['./scoring-mode-selector.component.scss'],
})
export class ScoringModeSelectorComponent {
  public readonly gameService = inject(GameService);

  public isDropdownOpen = signal(false);

  public toggleDropdown(): void {
    this.isDropdownOpen.update((v) => !v);
  }

  public selectMode(modeId: string): void {
    this.gameService.changeScoringMode(modeId);
    this.isDropdownOpen.set(false);
  }
}
