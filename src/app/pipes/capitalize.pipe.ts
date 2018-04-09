import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'bcCapitalize'})
export class CapitalizePipe implements PipeTransform {
    public transform(value: string, args: string[]): any {
        if (!value) { return value; }

        return value.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}
