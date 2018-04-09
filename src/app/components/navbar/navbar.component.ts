import { Component, Input } from '@angular/core';
import './navbar.component.scss';

import { AuthService } from '../../providers/AuthService/auth.service';

@Component({
    selector: 'bc-navbar',
    templateUrl: './navbar.component.html'
})

export class NavbarComponent {

    public currentUser = {
        name: 'Lela Bowers',
        avatar: '/assets/img/avatars/img2.jpg'
    };

    public hasInProfile = false;
    public hasInNavbar = false;
    public isOpen = false;

    @Input()
    public isClicked: boolean = false;

    constructor(
        private authService: AuthService
    ) {}

    public showUserNav() {
        if (this.isClicked) {
            this.isClicked = false;
        } else {
            this.isClicked = true;
        }
    }

    public toggleNavbar() {
        this.hasInNavbar = !this.hasInNavbar;
        if (this.hasInProfile) {
            this.hasInProfile = !this.hasInProfile;
        }
    }

    public toggleProfile() {
        this.hasInProfile = !this.hasInProfile;
        if (this.hasInNavbar) {
            this.hasInNavbar = !this.hasInNavbar;
        }
    }

    public signOut() {
        return this.authService.logout();
    }
}
