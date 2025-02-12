import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {routes} from './app.routes';
import {routesNoAuth} from './app.routes.no-auth';

const useAuth = false; // Ovde se menja između true (sa AuthGuard) i false (bez AuthGuard)

const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Change detection
    provideRouter(useAuth ? routes : routesNoAuth), // Configurations for the router
    provideHttpClient(),
    provideAnimationsAsync(),
  ],
};

export default appConfig;
