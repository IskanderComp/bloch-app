import { Component, OnInit } from '@angular/core';
import { FileViewService } from './file-view.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'efwe',
    template: '<div>Loading ...</div>'
})
export class FileComponent implements OnInit {
    constructor(
        public fvService: FileViewService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        fvService.itemId = this.route.snapshot.queryParams['id'];
        fvService.width = this.route.snapshot.queryParams['w'];
        fvService.height = this.route.snapshot.queryParams['h'];
    }

    public ngOnInit() {
        let id = this.fvService.itemId;
        let w = this.fvService.width;
        let h = this.fvService.height;
        let url = `file/${id}/${w}X${h}/view`;
        this.fvService.getItem();
        console.log('fm', this.fvService.fileModel);
        this.router.navigateByUrl(url);
    }
}
