System.register(['app/sbb/sbb.controller', 'app/sbb/connection.directive'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var sbb_controller_1, connection_directive_1;
    return {
        setters:[
            function (sbb_controller_1_1) {
                sbb_controller_1 = sbb_controller_1_1;
            },
            function (connection_directive_1_1) {
                connection_directive_1 = connection_directive_1_1;
            }],
        execute: function() {
            exports_1("default",angular
                .module('heischwumm.sbb', [
                'heischwumm.services'
            ])
                .controller('SbbController', sbb_controller_1.default)
                .directive('connection', connection_directive_1.default));
        }
    }
});
//# sourceMappingURL=sbb.module.js.map