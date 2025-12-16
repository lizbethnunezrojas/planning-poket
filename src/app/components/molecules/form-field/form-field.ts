import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputText } from '../../atoms/input-text/input-text';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, InputText],
  templateUrl: './form-field.html',
  styleUrls: ['./form-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() placeholder: string = '';

  get errorMessage(): string | null {
    const control = this.control;

    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Este campo es obligatorio.';
    }

    if (control.invalid && (control.dirty || control.touched)) {
      if (control.hasError('minlength')) {
        const requiredLength = control.getError('minlength').requiredLength;
        return `El nombre debe tener al menos ${requiredLength} caracteres.`;
      }

      if (control.hasError('maxlength')) {
        const requiredLength = control.getError('maxlength').requiredLength;
        return `El nombre no puede exceder los ${requiredLength} caracteres.`;
      }

      if (
        control.hasError('invalidSpecialChars')
      ) {
        return 'El nombre no puede contener caracteres especiales -_.*#/()%¿?¡!{}=$"°,;|[]';
      }
      if (
        control.hasError('tooManyNumbers')
      ) {
        return 'El nombre puede tener máx. 3 números';
      }

      if (control.hasError('required')) {
        return 'Este campo es obligatorio.';
      }
    }
    return null;
  }
}
