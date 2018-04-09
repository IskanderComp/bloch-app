// Import the core angular services.
import { ErrorHandler, Injector } from '@angular/core';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';

// Import the application components and services.
import { ErrorLogService } from './providers/error.log.service';
import { Router } from '@angular/router';

export interface LoggingErrorHandlerOptions {
  rethrowError: boolean;
  unwrapError: boolean;
}

export const LOGGING_ERROR_HANDLER_OPTIONS: LoggingErrorHandlerOptions = {
  rethrowError: false,
  unwrapError: false
};

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private errorLogService: ErrorLogService;
  private options: LoggingErrorHandlerOptions;
  private router: Router;

  constructor(errorLogService: ErrorLogService,
              injector: Injector,
              @Inject( LOGGING_ERROR_HANDLER_OPTIONS ) options: LoggingErrorHandlerOptions) {

    this.errorLogService = errorLogService;
    this.options = options;
    this.router = injector.get(Router);
  }

  // Handle the given error.
  public handleError( error: any ): void {

    // Send to the error-logging service.
    try {
      this.options.unwrapError ?
          this.errorLogService.logError(this.findOriginalError( error )) :
          this.errorLogService.logError(error);

      // this.router.navigateByUrl('/');
    } catch (loggingError) {
      console.group('ErrorHandler');
      console.warn('Error when trying to log error to', this.errorLogService);
      console.error(loggingError);
      console.groupEnd();
    }

    if (this.options.rethrowError) {
      throw( error );
    }
  }

  // Attempt to find the underlying error in the given Wrapped error.
  private findOriginalError(error: any): any {
    while (error && error.originalError) {
      error = error.originalError;
    }

    return( error );
  }
}

export const LOGGING_ERROR_HANDLER_PROVIDERS = [
  {
    provide: LOGGING_ERROR_HANDLER_OPTIONS,
    useValue: LOGGING_ERROR_HANDLER_OPTIONS
  },
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }
];
