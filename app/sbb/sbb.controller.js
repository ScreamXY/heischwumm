System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function SbbController(SbbService) {
        var vm = this;
        vm.from = null;
        vm.to = null;
        vm.loaded = true;
        vm.search = search;
        ////////////////
        function search() {
            if (vm.from && vm.to) {
                vm.loaded = false;
                SbbService.getCurrentConnection(vm.from, vm.to)
                    .success(function (data, status) {
                    vm.data = data;
                })
                    .error(function (data, status) {
                    console.error(data || 'Request failed');
                })
                    .finally(function () {
                    vm.loaded = true;
                });
            }
        }
    }
    return {
        setters:[],
        execute: function() {
            SbbController.$inject = ['SbbService'];
            exports_1("default",SbbController);
        }
    }
});
//# sourceMappingURL=sbb.controller.js.map