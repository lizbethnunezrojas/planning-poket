import {
  Component,
  inject,
  ChangeDetectionStrategy,
  computed,
  signal,
  ViewChild,
  HostListener,
} from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { InvitePlayersComponent } from '../../molecules/invite-players/invite-players.component';
import { CapitalizeWordsPipe } from '../../../shared/capitalize-words.pipe';
import { Router } from '@angular/router';
import { ScoringModeSelectorComponent } from '../../molecules/scoring-mode-selector/scoring-mode-selector.component';
import { UserActionMenuComponent } from '../../molecules/user-action-menu/user-action-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    InvitePlayersComponent,
    CapitalizeWordsPipe,
    ScoringModeSelectorComponent,
    UserActionMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  @ViewChild(InvitePlayersComponent) inviteComponent!: InvitePlayersComponent;
  @ViewChild(ScoringModeSelectorComponent) scoringComponent!: ScoringModeSelectorComponent;

  public isMenuOpen = signal(false);
  public isMobile = signal(window.innerWidth <= 600);

  public isCreatingGame = computed(() => !this.gameService.currentGame());

  public isRegisteringUser = computed(
    () => !!this.gameService.currentGame() && !this.gameService.currentUser()
  );

  public isInGame = computed(
    () => !!this.gameService.currentGame() && !!this.gameService.currentUser()
  );

  @HostListener('window:resize')
  onResize() {
    const mobileStatus = window.innerWidth <= 600;
    this.isMobile.set(mobileStatus);

    if (!mobileStatus) {
      this.isMenuOpen.set(false);
    }
  }

  public handleAvatarClick(): void {
    if (this.isMobile()) {
      this.isMenuOpen.update((v) => !v);
    } else {
      this.navigateToEditProfile();
    }
  }

  public onMenuAction(type: 'edit' | 'invite' | 'deck'): void {
    this.isMenuOpen.set(false);

    switch (type) {
      case 'edit':
        this.navigateToEditProfile();
        break;
      case 'invite':
        this.inviteComponent.openModal();
        break;
      case 'deck':
        this.scoringComponent.toggleDropdown();
        break;
    }
  }

  public navigateToEditProfile(): void {
    const gameId = this.gameService.currentGame()?.id;
    if (gameId) this.router.navigate(['/join', gameId]);
  }
}
