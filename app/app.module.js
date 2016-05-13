System.register(['app/app.routes', 'app/app.config', 'app/home/home.module', 'app/sbb/sbb.module', 'app/services/services.module'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var app_routes_1, app_config_1, home_module_1, sbb_module_1, services_module_1;
    return {
        setters:[
            function (app_routes_1_1) {
                app_routes_1 = app_routes_1_1;
            },
            function (app_config_1_1) {
                app_config_1 = app_config_1_1;
            },
            function (home_module_1_1) {
                home_module_1 = home_module_1_1;
            },
            function (sbb_module_1_1) {
                sbb_module_1 = sbb_module_1_1;
            },
            function (services_module_1_1) {
                services_module_1 = services_module_1_1;
            }],
        execute: function() {
            angular
                .module('heischwumm', [
                'ngRoute',
                'ngMaterial',
                home_module_1.default.name,
                sbb_module_1.default.name,
                services_module_1.default.name
            ])
                .config(app_routes_1.default)
                .config(app_config_1.default);
            angular.element(document).ready(function () {
                angular.bootstrap(document, ['heischwumm']);
            });
        }
    }
});
//# sourceMappingURL=app.module.js.map