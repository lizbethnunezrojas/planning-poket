import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormField } from '../molecules/form-field/form-field.component';
import { ModeSelectorGroupComponent } from '../molecules/mode-selector-group/mode-selector-group.component';
import { ButtonComponent } from '../atoms/button/button.component';
import { NameValidator, getNameErrorMessage  } from '../../core/validators/name.validator';

interface JoinGameFormValues {
  userName: string;
  viewMode: 'player' | 'spectator';
}

@Component({
  selector: 'app-join-game-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormField,
    ModeSelectorGroupComponent,
    ButtonComponent,
  ],
  templateUrl: './join-game-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameFormComponent {
  private readonly fb = inject(FormBuilder);

  @Output() joined = new EventEmitter<JoinGameFormValues>();

  public readonly joinForm: FormGroup = this.fb.group({
    userName: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        NameValidator,
      ],
    }),
    viewMode: this.fb.control<string | null>(null, {
      validators: [Validators.required]
    })
  });

  public get userNameControl(): FormControl {
    return this.joinForm.get('userName') as FormControl;
  }

  public get viewModeControl(): FormControl {
    return this.joinForm.get('viewMode') as FormControl;
  }

  public get userNameErrorMessage(): string | null {
    return getNameErrorMessage(this.userNameControl);
  }

  public onSubmit(): void {
    if (this.joinForm.valid) {
      const formValue = this.joinForm.value as JoinGameFormValues;
      this.joined.emit(formValue);
      this.joinForm.reset({ userName: '', viewMode: null });
    } else {
      this.joinForm.markAllAsTouched();
    }
  }
}
