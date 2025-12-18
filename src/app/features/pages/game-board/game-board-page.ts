import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CardComponent } from '../../../components/atoms/card/card.component';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-game-board-page',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './game-board-page.html'
})
export class GameBoardPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  currentUser = signal<User | null>(null);

  ngOnInit() {
    const gameIdFromUrl = this.route.snapshot.paramMap.get('id');
    const user = this.userService.getCurrentUser();

    // Aplicando Optional Chaining para una lectura más limpia
    if (!gameIdFromUrl || gameIdFromUrl !== user?.gameId) {
      console.warn('Acceso no autorizado o ID de partida incorrecto');
      this.router.navigate(['/create']);
      return;
    }

    

    this.currentUser.set(user);
  }
}