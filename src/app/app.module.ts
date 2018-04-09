import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, JsonpModule, XHRBackend, RequestOptions } from '@angular/http';
import { NgModule, ApplicationRef, Provider } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules } from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// import '../styles/styles.scss';
// import '../styles/headings.css';

// import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { MainModule } from './modules/main/main.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImportModule } from './import.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications/dist';
import { IsLoggedGuard } from './providers/AuthService/Guards/isLoggedGuard';
import { ErrorLogService } from './providers/error.log.service';
import { AppTranslateService } from './providers/translation';
import { ConfigService } from './providers/config.service';
import { HttpClient } from './providers/RestService/rest.client';
import { HttpService } from './providers/RestService/rest.interceptor';
import { LOGGING_ERROR_HANDLER_PROVIDERS } from './global.error.handler';
import { AuthService } from './providers/AuthService/auth.service';
import { UserService } from './providers/user.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

const INTERCEPT_PROVIDER = {
  provide: Http,
  useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, authService: AuthService, errorLogService: ErrorLogService) =>
      new HttpService(xhrBackend, requestOptions, authService, errorLogService),
  deps: [XHRBackend, RequestOptions, AuthService, ErrorLogService]
};

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateHttpLoader(http, '../assets/i18n', '.json'),
        deps: [Http]
      }
    }),
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    ReactiveFormsModule,
    ImportModule,
    SimpleNotificationsModule,
    MainModule,
    AuthModule,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    INTERCEPT_PROVIDER,
    HttpClient,
    ConfigService,
    AppTranslateService,
    ErrorLogService,
    NotificationsService,
    IsLoggedGuard,
    UserService,
    LOGGING_ERROR_HANDLER_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
