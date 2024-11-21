import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimizacija detekcije promena
    provideRouter(routes), // Konfiguracija rutiranja
    provideHttpClient(), // Omogućavanje HttpClient za API pozive
  ],
};
