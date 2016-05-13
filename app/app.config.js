System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function AnimateConfig($animateProvider) {
        $animateProvider.classNameFilter(/animate-/);
    }
    return {
        setters:[],
        execute: function() {
            AnimateConfig.$inject = ['$animateProvider'];
            exports_1("default",AnimateConfig);
        }
    }
});
//# sourceMappingURL=app.config.js.map