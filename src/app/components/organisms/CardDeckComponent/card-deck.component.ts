import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  inject,
  computed,
  input,
} from '@angular/core';
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
  public readonly gameService = inject(GameService);

  public readonly availableCards = this.gameService.availableCards;
  public readonly currentUser = this.gameService.currentUser;
  public isPreview = input<boolean>(false);

  public readonly isPlayer = computed(() => this.currentUser()?.viewMode === 'player');
  public isAnimating = signal(false);

  public selectCard(value: string | number): void {
    this.gameService.selectCard(value);
  }

  public shouldDisplay = computed(() => this.isPlayer() || this.isPreview());

  constructor() {
    effect(() => {
      const mode = this.gameService.currentModeId();
      if (mode) {
        this.triggerNeonEffect();
      }
    });
  }

  private triggerNeonEffect() {
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 3000);
  }
}
