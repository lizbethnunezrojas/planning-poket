import { FormControl } from '@angular/forms';
import { NameValidator } from './name.validator';
import { describe, it, expect, beforeEach } from 'vitest';

describe('NameValidator - Pruebas de Lógica Pura', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  // ESCENARIOS DE ÉXITO 

  it('debería ser VÁLIDO si cumple todas las reglas (ej: MiPartida001)', () => {
    control.setValue('MiPartida001');
    const result = NameValidator(control);
    expect(result).toBeNull(); 
  });
  
  it('debería ser VÁLIDO con el máximo permitido de 3 números (ej: Partida123)', () => {
    control.setValue('Partida123');
    const result = NameValidator(control);
    expect(result).toBeNull();
  });

  // ESCENARIOS DE ERROR 

  it('debería ser INVÁLIDO si contiene caracteres especiales (ej: _ o /)', () => {
    control.setValue('Partida_Test');
    expect(NameValidator(control)).toEqual({ invalidSpecialChars: true });

    control.setValue('Partida/Test');
    expect(NameValidator(control)).toEqual({ invalidSpecialChars: true });
  });

  it('debería ser INVÁLIDO si excede el límite de 3 números (ej: Partida1234)', () => {
    control.setValue('Partida1234');
    expect(NameValidator(control)).toEqual({ tooManyNumbers: true });
  });

  it('debería ser INVÁLIDO si contiene espacios al inicio o solo espacios', () => {
    control.setValue(' Partida12');
    expect(NameValidator(control)).toEqual({ invalidSpaces: true });

    control.setValue('      ');
    expect(NameValidator(control)).toEqual({ invalidSpaces: true });
  });
});