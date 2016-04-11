(function() {
  'use strict';

  angular
    .module('heischwumm')
    .factory('SbbService', SbbService);

  SbbService.$inject = ['$http'];
  function SbbService($http) {
    var service = {
      getCurrentConnection: getCurrentConnection
    };

    var url = 'http://transport.opendata.ch/v1/connections';

    return service;

    ////////////////
    function getCurrentConnection(from, to) {
      var page = 0;
      var limit = 2;
      var query = url + '?from=' + from + '&to=' + to + '&limit=' + limit + '&page=' + page;
      return $http.get(query);
    }
  }
})();
