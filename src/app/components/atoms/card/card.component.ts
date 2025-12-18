import { Component, computed, input } from '@angular/core';
import { ViewMode } from '../../../core/models/user.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  viewMode = input.required<ViewMode>();
  value = input<string | null>(null);
  userName = input.required<string>();

  // Lógica para las iniciales del espectador
  initials = computed(() => 
    this.userName().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  );

  // Clases CSS dinámicas
  cardClass = computed(() => {
    if (this.viewMode() === 'spectator') return 'card--spectator';
    return this.value() ? 'card--selected' : 'card--empty';
  });
}