import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameForm } from './create-game-form.component';

describe('CreateGameForm', () => {
  let component: CreateGameForm;
  let fixture: ComponentFixture<CreateGameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGameForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
