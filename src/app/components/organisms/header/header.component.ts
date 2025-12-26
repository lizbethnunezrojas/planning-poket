import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { InvitePlayersComponent } from '../../molecules/invite-players/invite-players.component';
import { CapitalizeWordsPipe } from '../../../shared/capitalize-words.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [InvitePlayersComponent, CapitalizeWordsPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly gameService = inject(GameService);

  public isCreatingGame = computed(() => !this.gameService.currentGame());

  public isRegisteringUser = computed(
    () => !!this.gameService.currentGame() && !this.gameService.currentUser()
  );

  public isInGame = computed(
    () => !!this.gameService.currentGame() && !!this.gameService.currentUser()
  );
}
