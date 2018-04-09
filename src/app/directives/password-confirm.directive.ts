import { Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[isPasswordConfirmed]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IsPasswordConfirmedDirective),
    multi: true
  }]
})
export class IsPasswordConfirmedDirective implements Validator {

  @Input()
  public isPasswordConfirmed: string;

  public validate(control: AbstractControl): any {
    if (!control.value || (control.value === this.isPasswordConfirmed)) {
      return null;
    } else {
      return {passwordNotConfirmed: true};
    }
  }
}
