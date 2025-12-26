import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { JoinGameFormComponent } from '../../../components/organisms/join-game-form/join-game-form.component';
import { GameService } from '../../../core/services/game.service';
import { ViewMode } from '../../../core/models/user.model';
import { GameTableDesignComponent } from '../../../components/molecules/game-table-design/game-table-design.component';
import { CardDeckComponent } from '../../../components/organisms/CardDeckComponent/card-deck.component';

@Component({
  selector: 'app-join-game-page',
  standalone: true,
  imports: [JoinGameFormComponent, GameTableDesignComponent, CardDeckComponent],
  templateUrl: './join-game-page.html',
  styleUrls: ['./join-game-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGamePage {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  public id = input.required<string>();

  public handleJoin(userData: { name: string; viewMode: ViewMode }): void {
    this.gameService.registerUser(userData.name, userData.viewMode, this.id());

    const currentUser = this.gameService.currentUser();

    if (currentUser) {
      this.router.navigate(['/game', this.id()]);
    }
  }
}
