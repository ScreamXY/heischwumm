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
      .otherwise({
        redirectTo: '/'
      });
  }
})();
