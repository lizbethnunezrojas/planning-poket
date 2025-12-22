import { render, screen, fireEvent } from '@testing-library/angular';
import { CreateGameForm } from './create-game-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { FormField } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';

describe('CreateGameForm - Validación de Negocio', () => {
  
  const setup = async () => {
    return await render(CreateGameForm, {
      imports: [ReactiveFormsModule, FormField, ButtonComponent],
    });
  };

  it('debería tener el botón deshabilitado inicialmente (AC - Campo requerido)', async () => {
    await setup();
    const button = screen.getByRole('button', { name: /crear partida/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('debería habilitar el botón cuando el nombre es válido (AC - Validadores)', async () => {
    await setup();
    const input = screen.getByLabelText(/nombra la partida/i);
    const button = screen.getByRole('button', { name: /crear partida/i });

    fireEvent.input(input, { target: { value: 'Sprint 01' } });
    
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('debería emitir gameCreated con el valor correcto al hacer submit', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.gameCreated, 'emit');

    const input = screen.getByLabelText(/nombra la partida/i);
    fireEvent.input(input, { target: { value: 'Proyecto Poker' } });

    // Ejecutamos el método onSubmit directamente o mediante el click del botón
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith('Proyecto Poker');
  });

  it('debería mostrar mensaje de error cuando el campo es tocado y está vacío', async () => {
    const { fixture } = await setup();
    const component = fixture.componentInstance;

    const input = screen.getByLabelText(/nombra la partida/i);
    
    fireEvent.blur(input);
    component.onSubmit();
    fixture.detectChanges();

    expect(component.nameErrorMessage).not.toBeNull();
  });
});