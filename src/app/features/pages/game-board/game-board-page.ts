import { Component, inject } from '@angular/core';
import { GameTableComponent } from '../../../components/organisms/game-table/game-table.component';
import { CardDeckComponent } from '../../../components/organisms/CardDeckComponent/card-deck.component';
import { VoteSummaryComponent } from '../../../components/molecules/vote-summary/vote-summary.component';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-board-page',
  standalone: true,
  imports: [GameTableComponent, CardDeckComponent, VoteSummaryComponent],
  templateUrl: './game-board-page.html',
  styleUrls: ['./game-board-page.scss'],
})
export class GameBoardPage {
  public readonly gameService = inject(GameService);
}
