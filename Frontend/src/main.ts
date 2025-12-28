import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

// Register HttpClient and the AuthInterceptor so outgoing requests include the Authorization header
// Use `withInterceptorsFromDi: true` so HttpClient uses interceptors provided via DI
bootstrapApplication(App, {
  providers: [
    // configure HttpClient to include DI-provided interceptors
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...appConfig.providers || []
  ]
})
  .catch((err) => console.error(err));

