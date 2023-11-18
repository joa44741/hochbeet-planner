import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { awsAuthInterceptor } from './aws-auth.interceptor';
import * as hochbeetEffects from './state/hochbeet.effects';
import * as plantsEffects from './state/plants.effects';

import { hochbeetReducer } from './state/hochbeet.reducer';
import { plantsReducer } from './state/plants.reducer';

// Code snippet from aws-auth.interceptor.ts
// import { switchMap } from 'rxjs/operators';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([awsAuthInterceptor])),
    provideStore({
      plants: plantsReducer,
      hochbeetState: hochbeetReducer,
      router: routerReducer
    }),
    provideEffects(hochbeetEffects, plantsEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: false, // !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75 // maximum stack trace frames to be stored (in case trace option was provided as true)}),
    }),
    provideRouterStore()
  ]
};
