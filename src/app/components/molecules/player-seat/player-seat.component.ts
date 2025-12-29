import {
  Component,
  input,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CardComponent } from '../../atoms/card/card.component';
import { GameService } from '../../../core/services/game.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-player-seat',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './player-seat.component.html',
  styleUrl: './player-seat.component.scss',
})
export class PlayerSeatComponent {
  private readonly gameService = inject(GameService);
  private readonly elementRef = inject(ElementRef);

  player = input.required<User>();
  isRevealed = input<boolean>(false);

  isMenuOpen = signal(false);

  canManage = computed(() => {
    const me = this.gameService.currentUser();
    const target = this.player();
    return me?.role === 'admin' && me.id !== target.id && target.role !== 'admin';
  });

  toggleMenu(event: Event): void {
    if (this.canManage()) {
      event.stopPropagation();
      this.isMenuOpen.update((v) => !v);
    }
  }

  handlePromote(): void {
    this.gameService.toggleSubAdmin(this.player().id);
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen.set(false);
    }
  }
}
