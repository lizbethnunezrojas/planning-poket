import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const NameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const name = (control.value as string) || '';

  if (!name) return null;

  if (name.length < 5 || name.length > 20) {
    return { invalidLength: { current: name.length, required: '5-20' } };
  }

  if (name.trim().length !== name.length) {
    return { invalidSpaces: true };
  }

  const specialCharsRegex = /[-_.*#/()%¿?¡!{}=$"°,;|'[\]\\]/;
  if (specialCharsRegex.test(name)) {
    return { invalidSpecialChars: true };
  }

  const onlyNumbersRegex = /^\d+$/;
  if (onlyNumbersRegex.test(name)) {
    return { onlyNumbers: true };
  }
  
  const numbersCount = (name.match(/\d/g) || []).length;
  if (numbersCount > 3) {
    return { tooManyNumbers: true };
  }
  return null;
};

export function getNameErrorMessage(control: AbstractControl | null): string | null {
  if (!control || !(control.dirty || control.touched)) {
    return null;
  }

  if (control.hasError('required')) {
    return 'Este campo es obligatorio.';
  }

  if (control.hasError('invalidLength')) {
    return 'El nombre debe tener entre 5 y 20 caracteres.';
  }

  if (control.hasError('invalidSpaces')) {
    return 'El nombre no puede tener espacios al inicio ni al final.';
  }

  if (control.hasError('invalidSpecialChars')) {
    return 'El nombre no puede contener caracteres especiales.';
  }

  if (control.hasError('tooManyNumbers')) {
    return 'El nombre puede tener máximo 3 números.';
  }

  if (control.hasError('onlyNumbers')) {
    return 'El nombre no puede contener solo números.';
  }

  return null;
}