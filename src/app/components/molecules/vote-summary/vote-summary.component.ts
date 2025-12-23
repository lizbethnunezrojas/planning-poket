import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-vote-summary',
  standalone: true,
  imports: [DecimalPipe ],
  templateUrl: './vote-summary.component.html',
  styleUrls: ['./vote-summary.component.scss']
})
export class VoteSummaryComponent {
  public gameService = inject(GameService);
}