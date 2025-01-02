import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread the existing configuration
  providers: [
    ...appConfig.providers || [],  // Ensure existing providers are included
    provideHttpClient(),           // Add HttpClient provider
  ],
})
  .catch((err) => console.error(err));
