import { Component, inject, computed } from '@angular/core';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  templateUrl: './game-actions.component.html',
  styleUrls: ['./game-actions.component.scss']
})
export class GameActionsComponent {
  public gameService = inject(GameService);

  public canReveal = computed(() => 
    this.gameService.players().some(p => p.hasSelectedCard)
  );
}