System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function AareService($http) {
        var service = {
            getCurrentInformation: getCurrentInformation
        };
        var url = 'http://aare.schwumm.ch/api/current';
        return service;
        ////////////////
        function getCurrentInformation() {
            return $http.get(url);
        }
    }
    return {
        setters:[],
        execute: function() {
            AareService.$inject = ['$http'];
            exports_1("default",AareService);
        }
    }
});
//# sourceMappingURL=aare.service.js.map