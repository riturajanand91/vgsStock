import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {} from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      MaterialModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      FontAwesomeModule  // Add FontAwesomeModule here
    ),
    provideAnimationsAsync('noop'),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIconPacks(fas);  // Add the solid icon pack
        return library;
      }
    }
  ]
};
