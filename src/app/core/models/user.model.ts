export type UserRole = 'admin' | 'player';
export type ViewMode = 'player' | 'spectator';

export interface User {
  id: string;        
  name: string;      
  role: UserRole;    
  viewMode: ViewMode;
  selectedCard?: string | null; 
  hasSelectedCard: boolean;
  gameId: string;
}

export type CreateUserPayload = Omit<User, 'id'>;