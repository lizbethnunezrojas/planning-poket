import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CardComponent (Atomo)', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('1. Debe instanciarse correctamente siguiendo el estándar de Vitest', () => {
    expect(component).toBeTruthy();
  });

  it('2. [Criterio Espectador] Debe mostrar las iniciales correctas en mayúsculas', () => {
    // Simulamos la entrada de datos desde la página
    fixture.componentRef.setInput('viewMode', 'spectator');
    fixture.componentRef.setInput('userName', 'lizie vi');
    
    fixture.detectChanges(); // Refrescamos el componente

    const compiled = fixture.nativeElement as HTMLElement;
    const initialsContainer = compiled.querySelector('.circle-content');
    
    // Verificamos lógica de negocio: "lizie vi" -> "LV"
    expect(initialsContainer?.textContent?.trim()).toBe('LV');
  });

  it('3. [HU3 Criterio 1] Debe mostrarse vacío (solo borde) si es jugador y no ha votado', () => {
    fixture.componentRef.setInput('viewMode', 'player');
    fixture.componentRef.setInput('userName', 'Liz');
    fixture.componentRef.setInput('value', null); // Sin carta seleccionada
    
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // Buscamos la clase que definimos para el estado vacío
    expect(compiled.querySelector('.card--empty')).toBeTruthy();
    expect(compiled.querySelector('.card-content')?.textContent?.trim()).toBe('');
  });

  it('4. [HU3 Criterio 2] Debe mostrar el valor cuando el jugador selecciona una carta', () => {
    fixture.componentRef.setInput('viewMode', 'player');
    fixture.componentRef.setInput('userName', 'Liz');
    fixture.componentRef.setInput('value', '8'); 
    
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-content')?.textContent?.trim()).toBe('8');
  });
});