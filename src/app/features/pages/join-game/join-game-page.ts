import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JoinGameFormComponent } from '../../../components/organisms/join-game-form/join-game-form.component';
import { GameService } from '../../../core/services/game.service';
import { ViewMode } from '../../../core/models/user.model';
@Component({
  selector: 'app-join-game-page',
  standalone: true,
  imports: [JoinGameFormComponent],
  templateUrl: './join-game-page.html',
  styleUrls: ['./join-game-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGamePage {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public handleJoin(userData: { name: string; viewMode: ViewMode }): void {
    const gameIdFromUrl = this.route.snapshot.paramMap.get('id') || '';

    this.gameService.registerUser(userData.name, userData.viewMode);

    const currentGame = this.gameService.currentGame();

    if (currentGame?.id === gameIdFromUrl) {
      this.router.navigate(['/game', gameIdFromUrl]);
    } 
  }
}
