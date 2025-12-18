import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JoinGameFormComponent } from '../../../components/organisms/join-game-form/join-game-form.component';
import { UserService } from '../../../core/services/user.service';
import { ViewMode } from '../../../core/models/user.model';


@Component({
  selector: 'app-join-game-page',
  standalone: true,
  imports: [JoinGameFormComponent],
  templateUrl: './join-game-page.html',
  styleUrls: ['./join-game-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGamePage {

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  
  public handleJoin(userData: { name: string; viewMode: ViewMode }): void {
    this.userService.saveUser(userData);
    
    console.log('[JoinGamePage] Usuario guardado:', this.userService.getCurrentUser());
  }

  
}