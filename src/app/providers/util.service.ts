import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
    // constructor(){}
    public getVideo(url: string, quality?: number) {
        if (quality) {
            return url + '?q=' + quality;
        } else {
            return url;
        }
    }

    /**
     * @param mimeType
     * @returns {string}
     */
    public getFileType(mimeType: string) {
        return mimeType.replace(/\/(.*)/, '');
    }
    public getFullUrl(baseUrl: string, file: any, size?: string) {
        let type: string;
        if (this.getFileType(file.metaData.mimeType) === 'video') {
            type = 'video';
        } else {
            type = 'files';
        }
        let sz = size ? `?s=${size}` : '';
        return `${baseUrl}/${type}/${file.id}/${file.name}${sz}`;
    }
    public getMaxValue(arr: number[]) {
        console.log(Math.max(...arr));
        return Math.max(...arr);
    }
}
