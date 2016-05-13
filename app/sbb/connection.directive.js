System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function Connection() {
        var directive = {
            templateUrl: './app/sbb/connection.directive.html',
            bindToController: true,
            controller: ConnectionController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                connectionData: '='
            }
        };
        return directive;
    }
    // ConnectionController.$inject = [''];
    function ConnectionController() {
        var vm = this;
    }
    return {
        setters:[],
        execute: function() {
            exports_1("default",Connection);
        }
    }
});
//# sourceMappingURL=connection.directive.js.map