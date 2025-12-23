import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
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
export class GameBoardPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

    public readonly gameService = inject(GameService);
  
  
  currentUser = signal<User | null>(null);
  allPlayers = signal<User[]>([]);
  isTableRevealed = signal<boolean>(false);

  ngOnInit() {
    const gameIdFromUrl = this.route.snapshot.paramMap.get('id');
    const user = this.userService.getCurrentUser();

    if (!gameIdFromUrl || gameIdFromUrl !== user?.gameId) {
      this.router.navigate(['/create']);
      return;
    }

    this.currentUser.set(user);
  }
}