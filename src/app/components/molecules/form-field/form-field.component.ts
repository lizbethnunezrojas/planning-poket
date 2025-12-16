import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() errorMessage: string | null = null;

  readonly inputId = `input-${crypto.randomUUID()}`;
}