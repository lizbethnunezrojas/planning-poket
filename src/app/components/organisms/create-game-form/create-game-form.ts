import { Component, ChangeDetectionStrategy, EventEmitter, Output, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

import { FormField } from '../../molecules/form-field/form-field';
import { NameValidator } from '../../../core/validators/name';
import { Button } from '../../atoms/button/button';

interface CreateGameFormValues {
  name: string;
}

@Component({
  selector: 'app-create-game-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormField, Button], 
  templateUrl: './create-game-form.html',
  styleUrls: ['./create-game-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CreateGameForm {
  
  private readonly fb = inject(FormBuilder); 

  @Output() gameCreated = new EventEmitter<string>();

  public createGameForm: FormGroup = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(20), 
        NameValidator 
      ]
    })
  });

  public get nameControl(): FormControl {
    return this.createGameForm.get('name') as FormControl;
  }
  
  public onSubmit(): void {
    if (this.createGameForm.valid) {
      const formValue = this.createGameForm.value as CreateGameFormValues;
      this.gameCreated.emit(formValue.name); 
      console.log('Partida creada con nombre:', formValue.name);
    } else {
      this.createGameForm.markAllAsTouched();
    }
  }
}