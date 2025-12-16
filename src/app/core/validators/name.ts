import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const NameValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const name = control.value as string;

  if (!name) {
    return null;
  }

  const specialCharsRegex = /[-_.*#/()%¿?¡!{}=$"°,;|'[\]\\]/;
  if (specialCharsRegex.test(name)) {
    return { invalidSpecialChars: true };
  }

  const numbersCount = (name.match(/\d/g) || []).length;
  if (numbersCount > 3) {
    return { tooManyNumbers: true };
  }

  return null;
};

export function getNameErrorMessage(
  control: AbstractControl | null
): string | null {
  if (!control || !(control.dirty || control.touched)) {
    return null;
  }

  if (control.hasError('required')) {
    return 'Este campo es obligatorio.';
  }

  if (control.hasError('minlength')) {
    return `El nombre debe tener al menos ${
      control.getError('minlength')?.requiredLength
    } caracteres.`;
  }

  if (control.hasError('maxlength')) {
    return `El nombre no puede exceder los ${
      control.getError('maxlength')?.requiredLength
    } caracteres.`;
  }

  if (control.hasError('invalidSpecialChars')) {
    return 'El nombre no puede contener caracteres especiales.';
  }

  if (control.hasError('tooManyNumbers')) {
    return 'El nombre puede tener máximo 3 números.';
  }

  return null;
}
