import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  public setCookie(name, value, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  public getCookie(name: string) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }

  public deleteCookie(name: string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
