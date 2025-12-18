import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateGameForm } from '../../../components/organisms/create-game-form/create-game-form.component';
import { GameService } from '../../../core/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game-page',
  standalone: true,
  imports: [CreateGameForm],
  templateUrl: './create-game-page.html',
  styleUrls: ['./create-game-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGamePage {
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  public handleGameCreation(gameName: string): void {
    this.gameService.createGame(gameName);

    this.router.navigate(['/join']);
  }
}
