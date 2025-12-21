import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { CardComponent } from '../../atoms/card/card.component';

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './card-deck.component.html',
  styleUrls: ['./card-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDeckComponent {
  private readonly gameService = inject(GameService);

  public readonly availableCards = this.gameService.availableCards;
  public readonly currentUser = this.gameService.currentUser;

  public readonly isPlayer = computed(() => this.currentUser()?.viewMode === 'player');

  public selectCard(value: string | number): void {
    this.gameService.selectCard(value);
  }
}