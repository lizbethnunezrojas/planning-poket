import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { GameTableDesignComponent } from '../../molecules/game-table-design/game-table-design.component';
import { CardComponent } from '../../atoms/card/card.component';

import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-game-table',
  standalone: true,
  imports: [GameTableDesignComponent, CardComponent],
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTableComponent {
  players = input.required<User[]>();
  tableRevealed = input<boolean>(false);
  currentUserId = input.required<string>();

  readonly SEAT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8];
  readonly TARGET_SEAT_ID = 7;

  playersInSeats = computed(() => {
    const seats: Record<number, User> = {};
    const allPlayers = this.players();
    const myId = this.currentUserId();

    const myIndex = allPlayers.findIndex(p => p.id === myId);

    const targetIndex = this.SEAT_ORDER.indexOf(this.TARGET_SEAT_ID); 
    const shift = myIndex >= 0 ? (targetIndex - myIndex) : 0;

    allPlayers.forEach((player, index) => {
      let seatIndex = (index + shift) % 8;

      if (seatIndex < 0) seatIndex += 8;

      const seatId = this.SEAT_ORDER[seatIndex];
      seats[seatId] = player;
    });

    return seats;
  });
}