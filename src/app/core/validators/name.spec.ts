import { FormControl } from '@angular/forms';
import { NameValidator } from './name.validator';

describe.skip('GameNameValidator', () => {
  const control = new FormControl('', NameValidator);

  // Exito

  it('debe ser VÁLIDO para nombres que cumplen todas las reglas (ej: MiPartida001)', () => {
    control.setValue('MiPartida001');
    expect(control.errors).toBeNull(); 
  });
  
  it('debe ser VÁLIDO con solo un número (ej: Partida1)', () => {
    control.setValue('Partida1');
    expect(control.errors).toBeNull();
  });
  
  it('debe ser VÁLIDO con el máximo de 3 números (ej: Partida123)', () => {
    control.setValue('Partida123');
    expect(control.errors).toBeNull();
  });

  // Error

  it('debe ser INVÁLIDO si contiene el caracter especial _', () => {
    control.setValue('Partida_Test');
    expect(control.errors).toEqual({ invalidSpecialChars: true });
  });

  it('debe ser INVÁLIDO si contiene el caracter especial /', () => {
    control.setValue('Partida/Test');
    expect(control.errors).toEqual({ invalidSpecialChars: true });
  });

  it('debe ser INVÁLIDO si contiene más de 3 números (ej: Partida1234)', () => {
    control.setValue('Partida1234');
    expect(control.errors).toEqual({ tooManyNumbers: true });
  });

  it('debe ser INVÁLIDO si contiene espacios al comienzo', () => {
    control.setValue(' Partida12');
    expect(control.errors).toEqual({ invalidSpaces: true });
  });

  it('debe ser INVÁLIDO si contiene solo espacios', () => {
    control.setValue('      ');
    expect(control.errors).toEqual({ invalidSpaces: true });
  });

});