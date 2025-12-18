import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioSelectorComponent } from '../../../components/atoms/radio-selector/radio-selector.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-game',
  standalone: true,
  imports: [CommonModule, RadioSelectorComponent, ReactiveFormsModule],
  template: `
    <div>
      <app-radio-selector
        id="radio-player"
        name="user-role"
        value="player"
        label="Jugador"
        [control]="modeControl"
      >
      </app-radio-selector>

      <app-radio-selector
        id="radio-spectator"
        name="user-role"
        value="spectator"
        label="Espectador"
        [control]="modeControl"
      >
      </app-radio-selector>
    </div>
  `,
})
export class JoinGamePage {
  modeControl = new FormControl(null);
}
