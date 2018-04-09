import { Component, Input } from '@angular/core';
import './vr-player.component.scss';
import { VrPlayerService } from './vr-player.service';
@Component({
    selector: 'vr-player',
    templateUrl: './vr-player.component.html'
})
export class VrPlayerComponent {
    @Input() public is360: boolean = false;
    @Input() public items: any[];

    constructor(private vrService: VrPlayerService) {}
}
