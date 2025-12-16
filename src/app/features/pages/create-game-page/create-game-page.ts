import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateGameForm } from '../../../components/organisms/create-game-form/create-game-form';

@Component({
  selector: 'app-create-game-page',
  standalone: true,
  imports: [CreateGameForm],
  templateUrl: './create-game-page.html',
  styleUrls: ['./create-game-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGamePage {

  public handleGameCreation(gameName: string): void {
    console.log(`Página: Creando partida con nombre: ${gameName}`);
  }
}