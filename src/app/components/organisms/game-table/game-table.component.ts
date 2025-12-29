import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { GameTableDesignComponent } from '../../molecules/game-table-design/game-table-design.component';

import { User } from '../../../core/models/user.model';
import { GameService } from '../../../core/services/game.service';
import { GameActionsComponent } from '../../molecules/game-actions/game-actions.component';
import { PlayerSeatComponent } from '../../molecules/player-seat/player-seat.component';

@Component({
  selector: 'app-game-table',
  standalone: true,
  imports: [GameTableDesignComponent, GameActionsComponent, PlayerSeatComponent],
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTableComponent {
  public readonly gameService = inject(GameService);

  tableRevealed = input<boolean>(false);

  private readonly players = this.gameService.players;
  private readonly currentUser = this.gameService.currentUser;

  readonly SEAT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8];
  readonly TARGET_SEAT_ID = 7;

  playersInSeats = computed(() => {
    const seats: Record<number, User> = {};
    const allPlayers = this.players();
    const currentU = this.currentUser();

    if (!currentU || allPlayers.length === 0) return seats;
    const myId = currentU.id;
    const myIndex = allPlayers.findIndex((p) => p.id === myId);

    const targetIndex = this.SEAT_ORDER.indexOf(this.TARGET_SEAT_ID);
    const shift = myIndex >= 0 ? targetIndex - myIndex : 0;

    allPlayers.forEach((player, index) => {
      let seatIndex = (index + shift) % 8;

      if (seatIndex < 0) seatIndex += 8;

      const seatId = this.SEAT_ORDER[seatIndex];
      seats[seatId] = player;
    });

    return seats;
  });
}
