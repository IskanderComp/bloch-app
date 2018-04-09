import {
    Directive, Input, HostListener, ElementRef
} from '@angular/core';

@Directive({selector: '[modalCenter]'})
export class ModalCenterDirective {

    constructor(public element: ElementRef) {

    }

    public setPosition() {
        let height = this.element.nativeElement.offsetHeight;
        let windowHeight = window.innerHeight;
        this.element.nativeElement.style.marginTop =
            Math.floor((windowHeight - height) / 2) + 'px';
    }

    @HostListener('window:resize', ['$event', '$target'])
    public resize($event, $target): void {
        //this.setPosition();
    }
}
