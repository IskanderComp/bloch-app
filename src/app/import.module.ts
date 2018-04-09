import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* Directives */

/**
 * `ImportModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    declarations: [
    ],
    imports: [ // import Angular's modules
        CommonModule,
        FormsModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: Http) => new TranslateHttpLoader(http, '../assets/i18n', '.json'),
                deps: [Http]
            }
        }),
        NgbModalModule.forRoot(),

    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
    ],
    exports: [
        CommonModule,
        TranslateModule
    ]
})
export class ImportModule {
    // constructor(){}
}
