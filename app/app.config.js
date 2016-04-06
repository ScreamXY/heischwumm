(function() {
  'use strict';

  angular
    .module('heischwumm')
    .config(AnimateConfig);

  AnimateConfig.$inject = ['$animateProvider'];
  function AnimateConfig($animateProvider) {
    $animateProvider.classNameFilter(/animate-/);
  }

})();
