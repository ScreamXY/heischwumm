System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function SbbService($http) {
        var service = {
            getCurrentConnection: getCurrentConnection
        };
        var url = 'http://transport.opendata.ch/v1/connections';
        return service;
        ////////////////
        function getCurrentConnection(from, to) {
            var page = 0;
            var limit = 2;
            var query = url + '?from=' + from + '&to=' + to + '&limit=' + limit + '&page=' + page;
            return $http.get(query);
        }
    }
    return {
        setters:[],
        execute: function() {
            SbbService.$inject = ['$http'];
            exports_1("default",SbbService);
        }
    }
});
//# sourceMappingURL=sbb.service.js.map