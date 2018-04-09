import {Component, OnInit} from '@angular/core';
import {AppTranslateService} from "./providers/translation";

@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
    <simple-notifications></simple-notifications>`,
})
export class AppComponent implements OnInit {

  constructor(public translate: AppTranslateService) {
  }

  ngOnInit() {
    console.log('Initial App State');
  }
}
