System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function Routes($routeProvider) {
        $routeProvider
            .when('/', {
            templateUrl: './app/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
            .when('/sbb', {
            templateUrl: './app/sbb/sbb.html',
            controller: 'SbbController',
            controllerAs: 'vm'
        })
            .otherwise({
            redirectTo: '/'
        });
    }
    return {
        setters:[],
        execute: function() {
            Routes.$inject = ['$routeProvider'];
            exports_1("default",Routes);
        }
    }
});
//# sourceMappingURL=app.routes.js.map