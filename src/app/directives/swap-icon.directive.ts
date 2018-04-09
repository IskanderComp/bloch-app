import { Directive, ElementRef, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Directive({selector: '[bc-swap-icon]'})

export class SwapIconDirective implements OnInit, AfterViewChecked {
    public img: any;
    public original: String;
    public canSwap: boolean = true;

    constructor(private el: ElementRef, router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd
                && this.original && this.img.length) {
                this.img.item(0).src = this.original;
                this.el.nativeElement.getElementsByClassName('selected')
                    .item(0).style = '';
            }
        });
    }

    public ngOnInit() {
        this.img = this.el.nativeElement.getElementsByTagName('img');
        if (this.img.length) {
            this.original = this.img.item(0).src;
        }
    }

    public ngAfterViewChecked() {
        if (this.img.length) {
            if (this.el.nativeElement.classList.contains('selectedLink')) {
                this.img.item(0).src = this.img.item(0)
                    .getAttribute('data-alt-img');
                this.el.nativeElement.getElementsByClassName('selected')
                    .item(0).style = 'display: block';
                this.canSwap = false;
            }
        }
    }

    @HostListener('mouseenter')
    public onMouseEnter() {
        if (this.canSwap && this.img.length) {
            this.img.item(0).src = this.img.item(0).getAttribute('data-alt-img');
        }
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        if (this.canSwap && this.img.length) {
            this.img.item(0).src = this.original;
        }
    }
}
