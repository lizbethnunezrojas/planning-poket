export type UserRole = 'admin' | 'sub-admin' | 'player';
export type ViewMode = 'player' | 'spectator';

export interface User {
  id: string;        
  name: string;      
  role: UserRole;    
  viewMode: ViewMode;
  selectedCard?: string | null; 
  hasSelectedCard: boolean;
  gameId: string;
  isMock?: boolean;     
  initialVote?: string;
}

export type CreateUserPayload = Omit<User, 'id'>;