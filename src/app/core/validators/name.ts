import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const NameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const name = control.value as string;
  if (!name) {
    return null; 
  }


  const specialCharsRegex = /[-_.*#/()%¿?¡!{}=$"°,;|'[\]\\]/;
  if (specialCharsRegex.test(name)) {
    return { 'invalidSpecialChars': true };
  }


  const numbersCount = (name.match(/\d/g) || []).length;
  if (numbersCount > 3) {
    return { 'tooManyNumbers': true };
  }
  
  return null;
};