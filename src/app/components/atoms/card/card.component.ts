import { Component, computed, HostBinding, input } from '@angular/core';
import { ViewMode } from '../../../core/models/user.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @HostBinding('attr.viewMode') get mode() {
    return this.viewMode();
  }

  viewMode = input<ViewMode>('player');
  value = input<string | null>(null);
  userName = input<string>('');
  isRevealed = input<boolean>(false);

  isSelected = input<boolean>(false);

  formattedName = computed(() => {
    const name = this.userName().trim();
    if (!name) return '';

    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  initials = computed(() =>
    this.userName()
      .split('')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  );

  cardClass = computed(() => {
    if (this.isSelected()) return 'card--selected';
    if (this.viewMode() === 'spectator') return 'card--spectator';

    const hasVoted = !!this.value();
    const revealed = this.isRevealed();

    if (!hasVoted) {
      return 'card--empty';
    }

    return revealed ? 'card--revealed' : 'card--hidden';
  });
}
