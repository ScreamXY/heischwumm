(function() {
  'use strict';

  angular
    .module('heischwumm')
    .directive('connection', Connection);

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
})();
