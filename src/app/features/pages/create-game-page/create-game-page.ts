import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreateGameForm } from '../../../components/organisms/create-game-form/create-game-form.component';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-create-game-page',
  standalone: true,
  imports: [CreateGameForm],
  templateUrl: './create-game-page.html',
  styleUrls: ['./create-game-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGamePage {
  private readonly gameService = inject(GameService);

  public handleGameCreation(gameName: string): void {
    const gameId = this.gameService.createGame(gameName);

    console.log(`[LÓGICA COMPLETADA] Partida creada y guardada. ID: ${gameId}`);
  }
}
