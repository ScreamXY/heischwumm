System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function WeatherService($http) {
        var service = {
            getCurrentWeather: getCurrentWeather
        };
        var url = 'http://api.openweathermap.org/data/2.5/weather/';
        var city = 'Bern';
        var apiKey = '0f8e28ee524f5bfd36a6dbbbe6197235';
        return service;
        ////////////////
        function getCurrentWeather() {
            return $http.get(url + '?q=' + city + '&units=metric&lang=de' + '&APPID=' + apiKey);
        }
    }
    return {
        setters:[],
        execute: function() {
            WeatherService.$inject = ['$http'];
            exports_1("default",WeatherService);
        }
    }
});
//# sourceMappingURL=weather.service.js.map