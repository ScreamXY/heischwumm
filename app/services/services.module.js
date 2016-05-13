System.register(['app/services/aare.service', 'app/services/sbb.service', 'app/services/weather.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aare_service_1, sbb_service_1, weather_service_1;
    return {
        setters:[
            function (aare_service_1_1) {
                aare_service_1 = aare_service_1_1;
            },
            function (sbb_service_1_1) {
                sbb_service_1 = sbb_service_1_1;
            },
            function (weather_service_1_1) {
                weather_service_1 = weather_service_1_1;
            }],
        execute: function() {
            exports_1("default",angular
                .module('heischwumm.services', [])
                .factory('AareService', aare_service_1.default)
                .factory('SbbService', sbb_service_1.default)
                .factory('WeatherService', weather_service_1.default));
        }
    }
});
//# sourceMappingURL=services.module.js.map