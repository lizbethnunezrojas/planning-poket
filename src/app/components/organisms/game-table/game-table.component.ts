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

  playersInSeats = computed(() => {
    const seats: Record<number, User> = {};
    const seatOrder = [1, 2, 3, 4, 5, 6, 7, 8];

    this.players().forEach((player, index) => {
      if (index < seatOrder.length) {
        seats[seatOrder[index]] = player;
      }
    });

    return seats;
  });
}
