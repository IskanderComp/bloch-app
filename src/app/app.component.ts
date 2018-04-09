/*
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppTranslateService } from './providers/translation';
import '../assets/scss/main.scss';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: `
        <router-outlet></router-outlet>
        <simple-notifications></simple-notifications>
  `
})
export class AppComponent implements OnInit {

  // constructor(public translate: AppTranslateService) {
  // }

  public ngOnInit() {
    console.log('Initial App State');
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
