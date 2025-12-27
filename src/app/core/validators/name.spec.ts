import { FormControl } from '@angular/forms';
import { NameValidator } from './name.validator';
import { describe, it, expect } from 'vitest';

describe('NameValidator - Pruebas de Lógica Pura', () => {
  let control: FormControl;

  it('debería ser válido con un nombre que cumple todas las reglas (ej. Elizabeth)', () => {
    const control = new FormControl('Elizabeth');
    expect(NameValidator(control)).toBeNull();
  });

  it('debería fallar si el nombre tiene menos de 5 caracteres (Criterio 2)', () => {
    const control = new FormControl('Alex');
    const result = NameValidator(control);
    expect(result).toHaveProperty('invalidLength');
  });

  it('debería fallar si el nombre tiene más de 20 caracteres (Criterio 2)', () => {
    const control = new FormControl('EsteNombreEsDemasiadoLargoParaElSistema');
    const result = NameValidator(control);
    expect(result).toHaveProperty('invalidLength');
  });

  it('debería fallar si contiene caracteres especiales como _ o * (Criterio 2)', () => {
    const control = new FormControl('Alexa_123');
    expect(NameValidator(control)).toEqual({ invalidSpecialChars: true });
  });

  it('debería fallar si tiene más de 3 números (Criterio 2)', () => {
    const control = new FormControl('Player1234');
    expect(NameValidator(control)).toEqual({ tooManyNumbers: true });
  });

  it('debería fallar si el nombre contiene solo números (Criterio 2)', () => {
    const control = new FormControl('12345');
    expect(NameValidator(control)).toEqual({ onlyNumbers: true });
  });

  it('debería fallar si hay espacios al inicio o al final', () => {
    const control = new FormControl(' Elizabeth ');
    expect(NameValidator(control)).toEqual({ invalidSpaces: true });
  });
});
