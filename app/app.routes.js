(function() {
  'use strict';

  angular
    .module('heischwumm')
    .config(Routes);

  Routes.$inject = ['$routeProvider'];
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
})();
