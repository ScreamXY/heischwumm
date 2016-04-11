(function() {
  'use strict';

  angular
    .module('heischwumm')
    .controller('SbbController', SbbController);

  SbbController.$inject = ['SbbService'];
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
          .success(function(data, status) {
            vm.data = data;
          })
          .error(function(data, status) {
            console.error(data || 'Request failed');
          })
          .finally(function() {
            vm.loaded = true;
          });
      }
    }
  }
})();
