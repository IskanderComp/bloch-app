"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var RegisterComponent = (function () {
    function RegisterComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.model = {};
    }
    RegisterComponent.prototype.onSubmit = function (value) {
        var _this = this;
        this.userService.create(this.model)
            .subscribe(function (data) {
            console.log(data);
            // this.alertService.success('Registration successful', true);
            _this.router.navigate(['/auth/login']);
        }, function (error) {
            // this.alertService.error(error);
        });
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        selector: 'bc-register',
        templateUrl: './register.component.html'
    })
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
