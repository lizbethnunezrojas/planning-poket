import { Component, output, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-action-menu',
  standalone: true,
  templateUrl: './user-action-menu.component.html',
  styleUrls: ['./user-action-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionMenuComponent {
  isAdmin = input<boolean>(false);
  action = output<'edit' | 'invite' | 'deck'>();
}