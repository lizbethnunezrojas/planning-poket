import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormField } from '../../molecules/form-field/form-field.component';
import { ModeSelectorGroupComponent } from '../../molecules/mode-selector-group/mode-selector-group.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { NameValidator, getNameErrorMessage  } from '../../../core/validators/name.validator';

import { ViewMode} from '../../../core/models/user.model';

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
  styleUrls: ['./join-game-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameFormComponent {
  private readonly fb = inject(FormBuilder);

  @Output() userCreated = new EventEmitter<{ name: string; viewMode: ViewMode }>();

  public readonly joinForm: FormGroup = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        NameValidator,
      ],
    }),
    viewMode: this.fb.control<ViewMode | null>(null, {
      validators: [Validators.required]
    })
  });

  public get nameControl(): FormControl {
    return this.joinForm.get('name') as FormControl;
  }

  public get viewModeControl(): FormControl {
    return this.joinForm.get('viewMode') as FormControl;
  }

  public get nameErrorMessage(): string | null {
    return getNameErrorMessage(this.nameControl);
  }

public onSubmit(): void {
    if (this.joinForm.valid) {
      this.userCreated.emit(this.joinForm.value);
      this.joinForm.reset();
    } else {
      this.joinForm.markAllAsTouched();
    }
  }
}
