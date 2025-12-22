import { render} from '@testing-library/angular';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';

describe('AppComponent (Raíz)', () => {
  
  const setup = async () => {
    return await render(App, {
      providers: [
        provideRouter([]) 
      ]
    });
  };

  it('debería crear la aplicación correctamente', async () => {
    const { fixture } = await setup();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería contener el contenedor principal de navegación (router-outlet)', async () => {
    const { container } = await setup();
    const outlet = container.querySelector('router-outlet');
    expect(outlet).not.toBeNull();
  });
});