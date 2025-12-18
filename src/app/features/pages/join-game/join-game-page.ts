import { Component, ChangeDetectionStrategy } from '@angular/core';
import { JoinGameFormComponent } from '../../../components/organisms/join-game-form.component';

@Component({
  selector: 'app-join-game-page',
  standalone: true,
  imports: [JoinGameFormComponent],
  templateUrl: './join-game-page.html',
  styleUrls: ['./join-game-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGamePage {
  
  public handleJoin(formData: any): void {
    console.log('Formulario recibido en la página:', formData);
  }
}