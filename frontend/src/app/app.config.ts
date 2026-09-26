import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

/**
 * Aura's default primary colour is emerald. A public-service portal reads more
 * clearly with a blue primary, so only that palette is overridden.
 */
const CivicConnectPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.600}',
      600: '{blue.700}',
      700: '{blue.800}',
      800: '{blue.900}',
      900: '{blue.950}',
      950: '{blue.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      inputVariant: 'outlined',
      theme: {
        preset: CivicConnectPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
