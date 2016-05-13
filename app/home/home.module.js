System.register(['app/home/home.controller'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var home_controller_1;
    return {
        setters:[
            function (home_controller_1_1) {
                home_controller_1 = home_controller_1_1;
            }],
        execute: function() {
            exports_1("default",angular
                .module('heischwumm.home', [
                'heischwumm.services'
            ])
                .controller('HomeController', home_controller_1.default));
        }
    }
});
//# sourceMappingURL=home.module.js.map