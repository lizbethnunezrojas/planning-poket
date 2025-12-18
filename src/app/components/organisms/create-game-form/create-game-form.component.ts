import { Component, ChangeDetectionStrategy, EventEmitter, Output, inject } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

import { FormField } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';

import { NameValidator, getNameErrorMessage } from '../../../core/validators/name.validator';

interface CreateGameFormValues {
  name: string;
}

@Component({
  selector: 'app-create-game-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormField, ButtonComponent],
  templateUrl: './create-game-form.component.html',
  styleUrls: ['./create-game-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGameForm {
  private readonly fb = inject(FormBuilder);

  @Output() gameCreated = new EventEmitter<string>();

  public readonly createGameForm: FormGroup = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        NameValidator,
      ],
    }),
  });

  public get nameControl(): FormControl {
    return this.createGameForm.get('name') as FormControl;
  }

  public get nameErrorMessage(): string | null {
    return getNameErrorMessage(this.nameControl);
  }

  public onSubmit(): void {
    if (this.createGameForm.valid) {
      const formValue = this.createGameForm.value as CreateGameFormValues;
      this.gameCreated.emit(formValue.name);
      this.createGameForm.reset();
    } else {
      this.createGameForm.markAllAsTouched();
    }
  }
}
