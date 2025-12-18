import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute); 

  public handleJoin(userData: { name: string; viewMode: ViewMode }): void {
    const gameId = this.route.snapshot.paramMap.get('id') || '';

    console.log('¿Qué ID capturó la URL?:', gameId);
  console.log('Datos del formulario:', userData);

    this.userService.saveUser({
      ...userData,
      gameId: gameId,
    });

    console.log('[JoinGamePage] Usuario guardado:', this.userService.getCurrentUser());
    
    if (gameId) {
      this.router.navigate(['/game', gameId]);
    }
  }

  
}