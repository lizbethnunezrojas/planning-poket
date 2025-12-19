import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { GameTableComponent } from '../../../components/organisms/game-table/game-table.component';

@Component({
  selector: 'app-game-board-page',
  standalone: true,
  imports: [GameTableComponent],
  templateUrl: './game-board-page.html',
  styleUrls: ['./game-board-page.scss'],
})
export class GameBoardPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  currentUser = signal<User | null>(null);
  allPlayers = signal<User[]>([]);
  isTableRevealed = signal<boolean>(false);

  ngOnInit() {
    const gameIdFromUrl = this.route.snapshot.paramMap.get('id');
    const user = this.userService.getCurrentUser();

    if (!gameIdFromUrl || gameIdFromUrl !== user?.gameId) {
      this.router.navigate(['/create']);
      return;
    }

    this.currentUser.set(user);

    const mockPlayers: User[] = [
      { id: '1', name: 'MMMMMMMMM', viewMode: 'player', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: true, selectedCard: '8' },
      { id: '2', name: 'Micaelaaaaaaaaaaaa 2', viewMode: 'player', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: true, selectedCard: '8' },
      { id: '3', name: 'Micaela 3', viewMode: 'player', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: true, selectedCard: '' },
      { id: '4', name: 'Micaela 4', viewMode: 'player', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: true, selectedCard: '8' },
      { id: '5', name: 'Micaela 5', viewMode: 'player', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: true, selectedCard: '8' },
      { id: '6', name: 'Jose 6', viewMode: 'spectator', gameId: gameIdFromUrl, role: 'player', hasSelectedCard: false, selectedCard: null },
      { id: '7', name: 'Ana 7', viewMode: 'player', gameId: gameIdFromUrl, role: 'admin', hasSelectedCard: false, selectedCard: null },
      user 
    ];

    this.allPlayers.set(mockPlayers);
  }
}