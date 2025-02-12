import {APP_INITIALIZER, enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {OAuthModule, OAuthService} from 'angular-oauth2-oidc';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import appConfig from './app/app.config';

export function initializeOAuth(oauthService: OAuthService) {
  return () => {
    oauthService.configure({
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin,
      clientId: environment.googleClientId,
      scope: 'openid profile email',
      strictDiscoveryDocumentValidation: false,
    });
    return oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      console.log('Discovery document loaded and login attempted.');
    });
  };
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    importProvidersFrom(OAuthModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeOAuth,
      multi: true,
      deps: [OAuthService],
    },
  ],
}).catch((err) => console.error(err));
