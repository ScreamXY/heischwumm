(function() {
  'use strict';

  angular
    .module('heischwumm')
    .controller('SbbController', SbbController);

  SbbController.$inject = ['$http'];
  function SbbController($http) {
    var vm = this;

    vm.from = null;
    vm.to = null;
    vm.loaded = true;
    vm.search = search;

    function search() {
      if (vm.from && vm.to) {
        vm.loaded = false;
        var url = 'http://transport.opendata.ch/v1/connections';
        var page = 0;
        var limit = 2;
        var from = vm.from;
        var to = vm.to;
        var query = url + '?from=' + from + '&to=' + to + '&limit=' + limit + '&page=' + page;

        $http.get(query)
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
