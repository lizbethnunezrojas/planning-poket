import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-invite-players',
  standalone: true,
  templateUrl: './invite-players.component.html',
  styleUrls: ['./invite-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitePlayersComponent {
  private readonly gameService = inject(GameService);

  public isModalOpen = signal(false);
  public copied = signal(false);

  public inviteUrl = computed(() => {
    const gameId = this.gameService.currentGame()?.id;
    return `${globalThis.location.origin}/join/${gameId}`;
  });

  public openModal() {
    this.isModalOpen.set(true);
  }

  public closeModal() {
    this.isModalOpen.set(false);
    this.copied.set(false);
  }

  public copyLink() {
    navigator.clipboard.writeText(this.inviteUrl()).then(() => {
      this.copied.set(true);

      setTimeout(() => {
        this.copied.set(false);
      }, 1000);
    });
  }
}
