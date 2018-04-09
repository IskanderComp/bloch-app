import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const translationEn = '../../assets/i18n/en.json';

@Injectable()
export class AppTranslateService {

    constructor(private translateService: TranslateService) {
        this.translateService.setDefaultLang('en');
        this.translateService.setTranslation('en', translationEn);
        this.translateService.use('en');
    }
}
