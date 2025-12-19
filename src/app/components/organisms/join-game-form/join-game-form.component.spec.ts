import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { vi } from 'vitest'; 
import { JoinGamePage } from '../../../features/pages/join-game/join-game-page';

describe('JoinGamePage', () => {
  let component: JoinGamePage;
  let fixture: ComponentFixture<JoinGamePage>;
  let userService: UserService;

  beforeEach(async () => {
    const routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [JoinGamePage],
      providers: [
        UserService,
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinGamePage);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    
    // Limpiamos el localStorage antes de cada test 
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should save user with role "admin" and generate an ID', () => {
    const saveSpy = vi.spyOn(userService, 'saveUser');
    
    const mockFormData = { 
      name: 'Lizbeth', 
      viewMode: 'player' as const 
    };

    component.handleJoin(mockFormData);

    expect(saveSpy).toHaveBeenCalledWith(mockFormData);

    const currentUser = userService.getCurrentUser();
    
    expect(currentUser).not.toBeNull();
    expect(currentUser?.name).toBe(mockFormData.name);
    expect(currentUser?.role).toBe('admin'); 
    expect(currentUser?.id).toBeDefined(); 
    expect(typeof currentUser?.id).toBe('string');
  });
});